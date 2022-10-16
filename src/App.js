import './App.css';
import React, { useState } from "react";
import Tesseract from 'tesseract.js';

function App() {
  const[file, setFile] = useState();
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState("");


  const not_good = ["cocoa"]; // list of bad ing
  const [value, setValue] = useState("Good"); // value to return good or bad
  let badIngre = ""; // ingr that was bad

  const onFileChange = (e) => {
    //console.log(e.target.files);
    setFile(e.target.files[0]);
  };



  function dropHandler(ev) {
    console.log('File(s) dropped');
  
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...ev.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === 'file') {
          const file = item.getAsFile();
          console.log(`… file[${i}].name = ${file.name}`);
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      [...ev.dataTransfer.files].forEach((file, i) => {
        console.log(`… file[${i}].name = ${file.name}`);
      });
    }
    
  }

  function dragOverHandler(ev) {
    console.log('File(s) in drop zone');
  
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }
  
  



  const processImage = () => {
    //console.log(file);
    Tesseract.recognize(
      file, 'eng', { logger: (m) => { 
        if (m.status === "recognizing text") {
          setProgress(m.progress);
        } 
      },
    }).then(({ data: { text } }) => {
      setResult(text);
      checkIngredients();
    });
    
  };

  const checkIngredients = () => {
    if (result !== "") {
      // split ing based on commas
      const arrInput = result.split(',')
      console.log(arrInput);

      // loop through list of user ingred
      for (let i = 0; i < arrInput.length; i++) {

        let currWord = arrInput[i].toLowerCase();

        currWord = currWord.trim();

        //console.log(currWord === not_good[0]);
        for (let j = 0; j < not_good.length; j++) {

          if (currWord === not_good[j]) {
            
            setValue("Bad");
            badIngre = currWord;
            
            break;
          }
        }
      }
    }
  }

  return (
    <div className="App">
     
      <input type = "file" onChange={onFileChange}/>
      <div style = {{marginTop: 25 }}>
        <input type = "button" value = "Submit" onClick = {processImage} />
      </div>
      <div>
        <progress value = {progress} max = {1} />
      </div>

     {result !==  "" && (<div style={{marginTop: 20, fontSize: 24, color: "teal"}}>
        Result: {result}
      </div>)} 

      <div> 
        { (<div style={{marginTop: 20, fontSize: 24, color: "teal"}}>
        
        Value: {value}

      </div>)}

      </div>

      <div
        id="drop_zone"
        onDrop={dropHandler}
        onDragOver={dragOverHandler}>
        <p>Drag one or more files to this <i>drop zone</i>.</p>
      </div>



    </div>
  );
}

export default App;
