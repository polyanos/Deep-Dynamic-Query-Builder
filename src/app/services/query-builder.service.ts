import {Injectable} from '@angular/core';
import {KeywordModel} from './keyword-model';

@Injectable({
    providedIn: 'root'
})
export class QueryBuilderService {

    constructor() {
    }

    createQuery(keywordModel: KeywordModel[]): string {
        const groupedKeywordModel = {};

        for (let i = 0; i < keywordModel.length; i++) {
            // Check if there is a keyword in this keyword model, if not skip it.
            if (keywordModel[i].keyword.length < 1) {
                continue;
            }

            // Check if there is a group specified in this keyword model, if not assign a random group to prevent grouping groupless
            // keywords.
            let group = keywordModel[i].group;
            if (group.length < 1) {
                group = '_' + i;
            }

            // Check if the group is already present and if so add the keyword model to that groups array.
            // If the group is present yet create a new array for that group.
            if (groupedKeywordModel[group] == null) {
                groupedKeywordModel[group] = [keywordModel[i]];
            } else {
                groupedKeywordModel[group].push(keywordModel[i]);
            }
        }

        const groupKeys = Object.keys(groupedKeywordModel);

        const groupedOrString = [];
        // Iterate over every group present, if a group has more than one keyword model we invoke createGroupOrString if not we invoke
        // createSynonymOrString
        for (let i = 0; i < groupKeys.length; i++) {
            if (groupedKeywordModel[groupKeys[i]].length > 1) {
                groupedOrString.push(this.createGroupOrString(groupedKeywordModel[groupKeys[i]]));
            } else {
                groupedOrString.push(this.createSynonymOrString(groupedKeywordModel[groupKeys[i]][0]));
            }
        }

        return this.createAndString(groupedOrString);
    }

    // Creates the OR query parts for the keyword and its synonyms
    private createSynonymOrString(keywordModel: KeywordModel): string {
        let trimmedSynonymArray;
        if (keywordModel.synonyms.length > 0) {
            trimmedSynonymArray = [keywordModel.keyword].concat(keywordModel.synonyms).map(item => item.trim());
            return '("' + trimmedSynonymArray.join('" OR "') + '")';
        } else {
            return '"' + keywordModel.keyword + '"';
        }
    }

    // Creates the OR query parts for the keyword groups. It will invoke createSynonymOrString method for the individual models and then
    // combine those strings.
    private createGroupOrString(groupedKeywordModel: KeywordModel[]): string {
        const synonymStrings = [];

        for (let i = 0; i < groupedKeywordModel.length; i++) {
            synonymStrings.push(this.createSynonymOrString(groupedKeywordModel[i]));
        }

        return '(' + synonymStrings.join(' OR ') + ')';
    }

    private createAndString(groupedOrStrings: string[]): string {
        return groupedOrStrings.join(' AND ');
    }
}
