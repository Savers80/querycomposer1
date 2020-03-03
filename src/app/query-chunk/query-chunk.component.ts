import { ViewChild, ElementRef, ViewRef, ViewContainerRef, Output, AfterViewInit, EventEmitter  } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
import {  OnChanges, SimpleChanges} from '@angular/core';

import { saveAs } from 'file-saver';
import * as CodeMirror from 'codemirror';

import { Chunk } from '../model/chunk';
import { RestApiService } from '../shared/rest-api.service';
import { MatSort, MatTableDataSource } from '@angular/material';
@Component({
  selector: 'app-query-chunk',
  templateUrl: './query-chunk.component.html',
  styleUrls: ['./query-chunk.component.scss']
})
export class QueryChunkComponent implements AfterViewInit, OnInit, OnChanges {


  @Input() chunk: Chunk;
  @ViewChild('descrizione') descrizioneRef: ElementRef;
  descrizione_readonly:boolean = true;
  @ViewChild('alias') aliasRef: ElementRef;
  alias_readonly:boolean = true;

  @ViewChild('chunkRaw') chunkRawRef: ElementRef;
  displayedColumns: string[] = ['name', 'weight', 'symbol', 'position'];
  public executeQuery_msg:string;

  @ViewChild('host') host: ElementRef;
  @Output() instance = null;
  _value = '';

  columnsToDisplay: string[] = this.displayedColumns.slice();
  data  = QueryChunkComponent.ELEMENT_DATA;
  datasource = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;

  constructor(public restApi: RestApiService ) { }
  ngAfterViewInit(){
      let mime = 'text/x-plsql';
      this.instance = CodeMirror.fromTextArea(this.host.nativeElement, {
            mode: mime,
            indentWithTabs: true,
            smartIndent: true,
            lineNumbers: true,
            matchBrackets : true,
            autofocus: true,
            extraKeys: {"Ctrl-Space": "autocomplete"},
            hintOptions: {tables: {
              users: ["name", "score", "birthDate"],
              countries: ["name", "population", "size"]
            }}
          });
      this.instance.refresh();
                    /*
      this.instance.setValue(this.chunk.query);
      this.instance.on('change', () => {
        this.updateValue(this.instance.getValue());
      });
      this.instance.on('focus', (instance, event) => {
        this.focus.emit({instance, event});
      });
    
      this.instance.on('cursorActivity', (instance) => {
        this.cursorActivity.emit({instance});
      });
    
      this.instance.on('blur', (instance, event) => {
        this.blur.emit({instance, event});
      });
      */
}

    @Output() change = new EventEmitter();
  @Output() focus = new EventEmitter();
  @Output() blur = new EventEmitter();
  @Output() cursorActivity = new EventEmitter();
  get value() { return this._value; }
  @Input() set value(v) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }
  

/**
 * Value update process
 */
updateValue(value) {
  this.value = value;
  this.onTouched();
  this.change.emit(value);
}

/**
 * Implements ControlValueAccessor
 */
writeValue(value) {
  this._value = value || '';
  if (this.instance) {
    this.instance.setValue(this._value);
  }
}

    onChange(_) {}
    onTouched() {}
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }

  ngOnInit() {
   // alert(JSON.stringify(this.chunk));
  // hljs.initHighlightingOnLoad();
    this.datasource.sort = this.sort;
    this.datasource.data = QueryChunkComponent.ELEMENT_DATA;
    this.datasource.filterPredicate = this.createFilter();
  }

   ngOnChanges(changes: SimpleChanges) {
    // alert("ciao");
   }

  listAllColumnsQuery(dataEmployee) {
    this.restApi.listAllColumnsQuery().subscribe((data: []) => {
      this.columnsToDisplay = data['columns_name'];
      this.displayedColumns = data['columns_name']; 
      this.data=[];
      data['rows'].forEach(element => {
        this.data.push(
          this.columnsToDisplay.reduce(function(acc, cur, i) {
            acc[ cur ] = element[i];
            return acc;
          }, {}) 
        )
      });

      console.log(this.data);
    })
    }

    executeQuery(dataEmployee) {
      console.log('execute:' +this.instance.getValue());
      this.restApi.executeQuery(this.instance.getValue( )).subscribe((data: []) => {
        this.columnsToDisplay = data['columns_name'];
        this.displayedColumns = data['columns_name']; 
        this.executeQuery_msg = data['msg']; 

        this.data=[];
        if (data['rows']){
          data['rows'].forEach(element => {
            this.data.push(
              this.columnsToDisplay.reduce(function(acc, cur, i) {
                acc[ cur ] = element[i];
                return acc;
              }, {}) 
            )
          });
        }
        console.log(this.data);
        this.datasource.data = this.data;
      });

      }

      applyFilter(filterValue: string) {
        this.datasource.filter = filterValue.trim().toLowerCase();
      }

  public static ELEMENT_DATA: any[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ];


  public createFilter(): (data: any, filter: any) => boolean {
    const filterFunction = function(data, filter): boolean {
      const searchData = JSON.parse(filter);
      let status = false;
      for (const key in searchData) {
        if (data[key].indexOf(searchData[key]) !== -1) {
          status = true;
        } else {
          status = false;
          break;
        }
      }
      return status;
    };
    return filterFunction;
  }

  public saveFile():void{
    let blob = new Blob([""], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "filename.txt",true);
  }


}