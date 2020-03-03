import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChunkParserService } from '../shared/chunk-parser.service';

@Component({
  selector: 'qc-workspace',
  templateUrl: './qc-workspace.component.html',
  styleUrls: ['./qc-workspace.component.scss']
})
export class QcWorkspaceComponent implements OnInit, AfterViewInit {

  public static a = `
  --#QC_CHUNK 
  --#QC_ALIAS# tableRef1 
  --#QC_DSCR# onInit While Flex-Layout makes every attempt to assign smart, valid flexbox stylings... 
  --#QC_DSCR# usages and some browsers will manifest layout issues.CanIuse.com reports and 
  --#QC_DSCR# many browsers issues using FlexBox; especially with IE browsers and Column stacking
  --#QC_DSCR# should consult the Known Issues and the Resources sections.
  --#QC_DROP# DROP TABLE tableRef1
      
  SELECT * FROM dicvalues_raw
  
  
  --#QC_CHUNK
  --#QC_ALIAS# tableRef2
  --#QC_DSCR# onInit While Flex-Layout makes every attempt to assign smart, valid flexbox stylings...
  --#QC_DSCR# usages and some browsers will manifest layout issues.CanIuse.com reports and
  --#QC_DSCR# many browsers issues using FlexBox; especially with IE browsers and Column stacking
  --#QC_DSCR# should consult the Known Issues and the Resources sections.
  --#QC_DROP# DROP TABLE tableRef2
       
  SELECT item -- single comment  
  FROM Orders -- another single comment
  WHERE id 
  ALL = (SELECT ID FROM Orders
  WHERE quantity > 25)

  `;
  tabs = [];

  constructor(private chunkParserService: ChunkParserService) { }
  ngOnInit() {}

  ngAfterViewInit(){
  console.log(QcWorkspaceComponent.a);    

 this.tabs.push({filename: 'prova', chunks_list: this.chunkParserService.toParseFileToChunk(QcWorkspaceComponent.a ) });


  }

  public onFileChange(event):void {
    let file = event.target.files[0];
    let reader = new FileReader();
    console.log(file);
    if(event.target.files && event.target.files.length > 0) {
      console.log(file);
      reader.onloadend= () => {
        this.tabs.push({filename: file.name, chunks_list: this.chunkParserService.toParseFileToChunk(<string>reader.result) });
        console.log( reader.result);
        
      };
      reader.readAsText(file);

    }
  }



}
