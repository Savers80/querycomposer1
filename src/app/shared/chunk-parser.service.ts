import { Injectable } from '@angular/core';
import { Chunk } from '../model/chunk';
import { stringify } from '@angular/core/src/render3/util';

@Injectable({
  providedIn: 'root'
})
export class ChunkParserService {
  public static QC_CHUNK:string = '--#QC_CHUNK';
  public static QC_ALIAS:string =  '--#QC_ALIAS#';
  public static QC_DSCR:string =  '--#QC_DSCR#';
  public static QC_DROP:string =  '--#QC_DROP#';

  constructor() { }

  toParseFileToChunk(chunkString:string):Chunk[]{
    let outList: Chunk[]= [];
    let chunkStringList: string[] = chunkString.split(ChunkParserService.QC_CHUNK);
    console.log("chunkStringList:" + JSON.stringify(chunkStringList) );

    chunkStringList.forEach( (value) =>{
        let chunk:Chunk = this.toParseToChunk(value);
        if (chunk && chunk.alias){
          outList.push(chunk);
        }
      }
      )

      console.log("outList:" + JSON.stringify(outList) );
    return outList;
  }

  

  toParseToChunk(chunkString:string):Chunk{

    let rows:string[] = chunkString.split('\n') ;
    console.log(rows);

    let chunk:Chunk = new Chunk();
    chunk.descrizione = '';
    chunk.query = '';
    rows.forEach( (row)=>{
      row = row.trim();
      switch(true) { 
        case (row.startsWith(ChunkParserService.QC_ALIAS)) : {  
          chunk.alias =  row.replace(ChunkParserService.QC_ALIAS,'');
          break; 
          }
        case (row.startsWith(ChunkParserService.QC_DSCR)) : {  
          chunk.descrizione +=  row.replace(ChunkParserService.QC_DSCR,'');
          break; 
          }
        case (row.startsWith(ChunkParserService.QC_DROP)) : {  
            //chunk.descrizione +=  row.replace(ChunkParserService.QC_DSCR,'');
            break; 
            }
        default:{
            chunk.query += row + '\n'; 
            break;
          }
        }
      }
    )

      return chunk;
  }



  createChunk(chunk:Chunk){
    let newline = "\n";   //String.fromCharCode(13, 10);
    let out:string = newline;
    let descr_chunks:string[] = chunk.descrizione.split(" ");
    let max_column :number = 80;
    let index_column:number=0;
    let out_descr:string="";
    descr_chunks.forEach(element => {
      if (index_column ==0){
        out_descr +=  newline+ '--#DSCR# ';
        index_column += '--#DSCR# '.length;
      }else if (index_column< max_column){
        out_descr += element + " ";
        index_column += element.length +1;
      }else{
        index_column = 0;
        out_descr += element + " ";
      }
    });
    
    let alias:string = '' + chunk.alias;
    out += out_descr +newline;
    out += '--#DROP# DROP TABLE ' + alias.trim() + newline;
    let queryChunks:string[]  = chunk.query.split("\n");
    for (let entry of queryChunks) {
      entry = entry.trim();
      if(entry !== undefined){
        if (entry.match('FROM')){
          out += '\t\t INTO '+ alias + newline;
        }
        out += entry + newline;
      }
  
    }
    return out;
  }
}
