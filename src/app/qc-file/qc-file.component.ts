import { Component,ViewChild, ElementRef , Input } from '@angular/core';
import {  OnChanges,OnInit, SimpleChanges} from '@angular/core';
import { Chunk} from '../model/chunk';

@Component({
  selector: 'qc-file',
  templateUrl: './qc-file.component.html',
  styleUrls: [ './qc-file.component.scss' ]
})
export class QcFileComponent  implements OnInit , OnChanges {
  name = 'Angular 6';

  @Input() public chunks_list:Chunk[] ;

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    //alert("ciao");
  }
getChunkList():Chunk[]{
  return this.chunks_list ;
}
  addChunk(){
    let chunk:Chunk = new Chunk();
    let index:number = this.chunks_list.length;
    chunk.alias = "alias_1 ";
    chunk.descrizione = 'descrizione_1';
    this.chunks_list.push(chunk);
  }

}
