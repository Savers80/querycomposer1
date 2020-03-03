import { Component, OnInit, Input } from '@angular/core';
import { Chunk } from '../model/chunk';
import { ChunkParserService } from '../shared/chunk-parser.service';

@Component({
  selector: 'app-query-composer',
  templateUrl: './query-composer.component.html',
  styleUrls: ['./query-composer.component.css']
})
export class QueryComposerComponent implements OnInit {
  
  @Input() chunks_list:Chunk[] ;
  
  constructor( private chunkParserService:ChunkParserService) { }

  ngOnInit() {
  }
  
createChunk(chunk:Chunk){
  let out:string = '';
  out = this.chunkParserService.createChunk(chunk);
  return out;
}
}