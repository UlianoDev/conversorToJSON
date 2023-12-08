import * as fs from 'fs';
import { exit } from 'process';
import * as xlsx from 'xlsx';

class ToJSON{

    private fileName: string;
    private fileExtention: string;
    private file:string;
    private separator?:string;

    constructor(fileName : string, fileExtention:string, separator?:string){
        this.fileName = fileName;
        this.fileExtention = fileExtention;
        this.file = `./${fileName}.${fileExtention}`;
        this.separator = separator;
        if(fileExtention == "csv" && !separator){
            console.log("Falha, não foi informado o separador do csv")
            exit()
        }
    }
     private readExcelFile():any{
        
      const file = xlsx.readFile(this.file)
      const sheetName = file.SheetNames[0]
      const sheet = file.Sheets[sheetName]
      const data = xlsx.utils.sheet_to_json(sheet,{header:1})
      return data



}
    private readCsvFile():any{
        const file = fs.readFileSync(this.file).toString()
        const arrayContentFile = file.split(/\r?\n/);
        const contentFileNoBlankSpaces = arrayContentFile.filter((row)=> !row.split(`${this.separator}`).every((item) => item.trim() == ''))
        const arrayWithArrays: string[][] = [];
        contentFileNoBlankSpaces.forEach((string)=> arrayWithArrays.push(string.split(`${this.separator}`)))
        return arrayWithArrays
    }
    private dataToJSON(typeOfFile?:any){
        const data = typeOfFile;
        console.log(typeOfFile)
        const keys: (string | number)[] = data[0] as (string | number)[];
        const dataValues = data.slice(1)
        const arrayOfObjects =  dataValues.map((rowValues:(string | number)[])=>{
          const obj:any = {}
          keys.forEach((key:(string | number),index:any)=>{
  
              obj[key] = rowValues[index] === undefined? '' : rowValues[index]
          })
          return obj;
        })
        const filterEmptyObjects =  arrayOfObjects.filter((obj:any)=> {
            const values = Object.values(obj);
            const isEmpty = values.every(value => value === '');
            return !isEmpty

        })
        const object = {"data": filterEmptyObjects}
        return object
    }
     writeJsonFromExcel(){
        const data = this.dataToJSON(this.readExcelFile());
        const jsonContent = JSON.stringify(data, null, 2);
        fs.writeFileSync('db.json',jsonContent,'utf-8')
        console.log("O arquivo foi criado com sucesso!")
       
    }
    writeJsonFromCsv(){
        const data = this.dataToJSON(this.readCsvFile());
        const jsonContent = JSON.stringify(data, null, 2);
        fs.writeFileSync('db.json',jsonContent,'utf-8')
        console.log("O arquivo foi criado com sucesso!")
       
    }
    writeCustomJson(){
        const arrayData = this.dataToJSON(this.readExcelFile()).data;
        //obj.nomeOrgao.slice(-2)
        const lastTwoWordsSet = new Set();
        arrayData.forEach((obj:any) => {
            const lastTwoWords = obj.nomeOrgao.slice(-2);
            lastTwoWordsSet.add(lastTwoWords);
          });

          const lastTwoWordsArray = Array.from(lastTwoWordsSet);
          let object: Record<string, any> = {}; 
          lastTwoWordsArray.forEach((event:any)=> {
            const arrayOfObjects = arrayData.filter((obj:any)=>obj.nomeOrgao.slice(-2) == event)
            //const objectReorganized = {event:arrayOfObjects}
            object[event] = arrayOfObjects
          }

          )
          const jsonContent = JSON.stringify(object, null, 2);
          fs.writeFileSync('db_personalizado.json',jsonContent,'utf-8')
          console.log("O arquivo personalizado foi criado com sucesso!")
    }
        
}

export default ToJSON;