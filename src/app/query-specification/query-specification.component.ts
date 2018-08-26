import {Component, OnInit, ViewChild} from '@angular/core';
import {QueryBuilderService} from '../services/query-builder.service';
import {MatTable} from '@angular/material';
import {KeywordModel} from '../services/keyword-model';

@Component({
    selector: 'app-query-specification',
    templateUrl: './query-specification.component.html',
    styleUrls: ['./query-specification.component.css']
})

export class QuerySpecificationComponent implements OnInit {
    @ViewChild(MatTable) table: MatTable<KeywordModel[]>;

    tableData: KeywordModel[] = [];
    displayedColumns: string[] = ['keyword', 'synonyms', 'group', 'options'];
    generatedQuery: string;

    constructor(private queryBuilderService: QueryBuilderService) {
        this.tableData.push({keyword: '', synonyms: [], group: ''});
    }

    // Creates a empty row and a empty model belonging to that row.
    newEmptyRow(): void {
        this.tableData.push({keyword: '', synonyms: [], group: ''});
        this.table.renderRows();
    }

    // Deletes the specified model which will remove the row.
    deleteRow(index: number) {
        this.tableData.splice(index, 1);
        this.table.renderRows();
    }

    // Adds the inputted group to the model, this will override the previous group with the new one.
    saveGroup(group: string, index: number) {
        if (!this.isEmptyString(group)) {
            this.tableData[index].group = group.toLowerCase().trim();
        } else {
            this.tableData[index].group = '';
        }
        this.table.renderRows();
    }

    // Adds the inputted keyword to the model, if the input is empty it will discard the input and keep the old value.
    // The added space in that case is so the old value reappears again.
    saveKeyword(keyword: string, index: number) {
        if (!this.isEmptyString(keyword)) {
            this.tableData[index].keyword = keyword.toLowerCase().trim();
        } else {
            this.tableData[index].keyword += ' ';
        }
    }

    // Saves the inputted synonyms to the model, this will override the previous inputted synonyms with the currently inputted ones.
    saveSynonyms(synonyms: string, index: number) {
        if (!this.isEmptyString(synonyms)) {
            this.tableData[index].synonyms = synonyms.split(',').map(item => item.trim().toLowerCase());
        } else {
            this.tableData[index].synonyms = [];
        }
        this.table.renderRows();
    }

    // Creates the boolean query by invoking the createQuery method of the injected service.
    createQuery(): void {
        this.generatedQuery = this.queryBuilderService.createQuery(this.tableData);
    }

    // Deletes the generated query so it disappears from the screen.
    resetQuery(): void {
        this.generatedQuery = null;
    }

    ngOnInit(): void {
    }

    private isEmptyString(string: string) {
        const trimmedString = string.trim();
        return trimmedString.length === 0;
    }
}
