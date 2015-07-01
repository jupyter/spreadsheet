# spreadsheet
A spreadsheet component for phosphor

Installation
------------
```bash
git clone https://github.com/jupyter/spreadsheet.git
cd spreadsheet
npm install
tsd reinstall -so
gulp
```
Build Phosphor either in the spreadsheet directory, or in a seperate directory on the same level as the spreadsheet directory.

Open the spreadsheet.html file.

Known Issues
------------
- Internet Explorer is missing some functionality. Chrome and Firefox appear to work fine.
- Cells do not resize properly when handing text longer than the width of the textbox.
- Certain keys will clear the text without adding anything

