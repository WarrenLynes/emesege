import fs from "fs";
import path from "path";

export function readFile(filename) {
  return new Promise((res, rej) => {
    fs.readFile(path.join(__dirname, `../data/${filename}.json`), 'utf8', function readFileCallback(err, data){
      if (err){
        console.log(err);
        rej(err);
      } else {

        res(JSON.parse(data));
      }});
  })
}

export function writeFile(filename, data) {
  return new Promise((res, rej) => {
    fs.writeFile(path.join(__dirname, `../data/${filename}.json`), JSON.stringify(data), 'utf8', (err, data) => {
      if(err) {
        return rej(err);
      }
      res(true)
    });
  })
}