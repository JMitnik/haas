import fs from 'fs';
import path from 'path';

import * as ejs from 'ejs'
import pdf from 'html-pdf';

const data = {
  font: {
    "color": "green",
    "include": "https://api.****.com/parser/v3/css/combined?face=Kruti%20Dev%20010,Calibri,DevLys%20010,Arial,Times%20New%20Roman"
  },
  testData: [
    {
      "name": "<p><span class=\"T1\" style=\"font-family:'DevLys 010'; margin: 0;\">0-06537 esa 5 dk LFkuh; eku gS&</span></p>"
    }]
};
const gethtmltopdf = async () => {
  try {

    const filePathName = path.resolve(__dirname, 'pdf_template.ejs');
    const htmlString = fs.readFileSync(filePathName).toString();
    let options: pdf.CreateOptions = { format: 'Letter' };
    const ejsData = ejs.render(htmlString, data);
    return pdf.create(ejsData, options).toFile('generatedfile.pdf', (err, response) => {
      if (err) return console.log(err);
      return response;
    });

  } catch (err) {
    console.log("Error processing request: " + err);
  }


}
gethtmltopdf().catch(error => console.log('Errorsssss: ', error));