
function DHL() {
    const fieldOrder = ['x', 10, 11, 13, 14, 'y', 16, 8, 23, 3, 7, 2, 'x', 20, 22, 17, 12, 19, 5, 5, 4, 6];

    const uniqueNumbers = [];

    // Array dei codici delle nazioni dell'Unione Europea
    const euCountryCodes = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];

    // Array dei codici telefonici delle nazioni dell'Unione Europea
    const euCountryPhoneCodes = ['43', '32', '359', '385', '357', '420', '45', '372', '358', '33', '49', '30', '36', '353', '39', '371', '370', '352', '356', '31', '48', '351', '40', '421', '386', '34', '46'];



    const CountryCodes = ['AL', 'AD', 'AM', 'AT', 'AZ', 'BY', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'GE', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'KZ', 'XK', 'LV', 'LI', 'LT', 'LU', 'MK', 'MT', 'MD', 'MC', 'ME', 'NL', 'NO', 'PL', 'PT', 'RO', 'RU', 'SM', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'TR', 'UA', 'GB', 'VA'];
    const CountryPhoneCodes = ['355', '376', '374', '43', '994', '375', '32', '387', '359', '385', '357', '420', '45', '372', '358', '33', '995', '49', '30', '36', '354', '353', '39', '7', '383', '371', '423', '370', '352', '389', '356', '373', '377', '382', '31', '47', '48', '351', '40', '7', '378', '381', '421', '386', '34', '46', '41', '90', '380', '44', '379'];



    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const csv = XLSX.utils.sheet_to_csv(worksheet);

        Papa.parse(csv, {
            complete: function (results) {
                const outputData = [];

                results.data.forEach((row, rowIndex) => {
                    const column5Value = row[5];

                    if (uniqueNumbers.includes(column5Value)) {
                        return;
                    }

                    uniqueNumbers.push(column5Value);
                });

                outputData.push([]);

                results.data.forEach((row, rowIndex) => {
                    const column0Value = row[1];

                    if (column0Value !== 'DHL EXPRESS (ITALY) SRL') {
                        return;
                    }

                    if (row[19].includes('EXPRESS') && euCountryCodes.includes(row[13])) {
                        row[19] = 'ECX';
                    }
                    else if (row[19].includes('EXPRESS') && !euCountryCodes.includes(row[13])) {
                        row[19] = 'WPX';
                    }
                    else if (row[19].includes('CAMIONISTICO') && euCountryCodes.includes(row[13])) {
                        row[19] = 'ESU';
                    }
                    else if (row[19].includes('CAMIONISTICO') && !euCountryCodes.includes(row[13])) {
                        row[19] = 'ESI';
                    }



                    const rowData = [];




                    fieldOrder.forEach((field, index) => {
                        let cellValue = '';

                        if (field === 'x') {
                            cellValue = 'VALORE DA IMPOSTARE';
                        } else {
                            const columnIndex = field - 1;

                            if (field === 16 && row[index] && row[index].startsWith('+')) {
                                cellValue = row[index].substring(1); // Rimuovi il carattere '+'
                            }


                            if (field === 'y' && row[14] && CountryCodes.includes(row[13])) {
                                const countryIndex = CountryCodes.indexOf(row[13]);
                                cellValue = CountryPhoneCodes[countryIndex];
                            } else {
                                cellValue = row[columnIndex] || '';
                            }


                            if (field === 2 && cellValue) {
                                cellValue = 'G';
                            }

                            if (field === 8 && cellValue) {
                                cellValue = '106968952';
                            }

                            if (field === 3 && cellValue) {
                                cellValue = 'EUR';
                            }

                            if (field === 4 && cellValue) {
                                cellValue = 'N';
                            }

                            if (field === 5 && cellValue) {
                                cellValue = 40;
                            }

                            if (field === 19 && cellValue) {
                                cellValue = 60;
                            }

                            if (field === 16 && cellValue == '') {
                                cellValue = '0000000000';
                            }

                            if (field === 22 && cellValue) {
                                cellValue = parseInt(cellValue);
                            }

                            if (field === 23 && cellValue) {
                                cellValue = parseInt(cellValue);
                            }

                            if (field === 17 && cellValue.includes(';')) {
                                cellValue = cellValue.split(';')[0];
                            }

                            if (field === 16 && cellValue.includes(')')) {
                                const indexOfClosingParenthesis = cellValue.indexOf(')');
                                cellValue = cellValue.substring(indexOfClosingParenthesis + 1);
                            }
                            else if (field === 16 && cellValue.includes('+')) {
                                const indexOfPlus = cellValue.indexOf('+');
                                cellValue = cellValue.substring(0, indexOfPlus) + cellValue.substring(indexOfPlus + 3);
                            }



                        }

                        rowData.push(cellValue);
                    });

                    outputData.push(rowData);

                    uniqueNumbers.splice(uniqueNumbers.indexOf(row[6]), 1);

                    outputData[0] = ['REFERENTE', ' ', ' ', ' ', 'CODICE NAZIONE (IT CE EN)', 'CODICE TELEFONO NAZIONE (+39 +41)', ' ', 'CODICE CLIENTE', ' ', 'VALUTA VALORE DICHIARATO', ' ', 'CODICE PRODOTTO', 'RIEPILOGO/DESCRIZIONE ORDINE', 'TIPO SPED', 'NUM COLLI', 'MAIL', 'CAP', 'LUNG COLLO', 'LARG COLLO', 'ALT COLLO', 'CONSEGNA SABATO', 'CODICE FATTURA'];


                });

                const exportFormat = document.getElementById('fileFormat').value;

                if (exportFormat === 'xls') {
                    const outputWorkbook = XLSX.utils.book_new();
                    const outputWorksheet = XLSX.utils.aoa_to_sheet(outputData);
                    XLSX.utils.book_append_sheet(outputWorkbook, outputWorksheet, 'Sheet 1');

                    const outputBuffer = XLSX.write(outputWorkbook, { type: 'array', bookType: 'xls' });
                    saveFile(outputBuffer, 'output.xls');
                } else if (exportFormat === 'csv') {
                    const csvContent = Papa.unparse(outputData);

                    saveFile(csvContent, 'output.csv');
                }
            }
        });
    };

    reader.readAsArrayBuffer(file);
}

function SDA() {
    const fieldOrder = [8, '?', 10, 12, 11, 15, 16, 13, 'ITA', '?', '?', '?', '?', '?', '?', '?', 15, '?', '?', '?', '?', '?'];
    const uniqueNumbers = [];
    const outputData = [];

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const csv = XLSX.utils.sheet_to_csv(worksheet);

        Papa.parse(csv, {
            complete: function (results) {
                // Estrae i valori unici dalla colonna 5
                results.data.forEach((row) => {
                    const column5Value = row[5];
                    if (!uniqueNumbers.includes(column5Value)) {
                        uniqueNumbers.push(column5Value);
                    }
                });

                // Header personalizzato
                outputData.push([
                    "RagioneSociale",
                    "Referente",
                    "Indirizzo",
                    "Localita",
                    "CAP",
                    "Telefono",
                    "EMail",
                    "Provincia",
                    "Stato",
                    "TipoIndirizzo",
                    "FlagRitiro",
                    "FlagNazionale",
                    "FlagAttivo",
                    "CodiceRicerca",
                    "GruppoUtenti",
                    "Fax",
                    "Cellulare",
                    "CodiceFiscale",
                    "PartitaIVA",
                    "IdFiscale",
                    "UserName",
                    "IdCliente"
                ]);

                // Iniziare a iterare dalla seconda riga (indice 1)
                results.data.forEach((row, index) => {
                    // Salta la prima riga
                    if (index === 0) return;

                    const rowData = [];

                    fieldOrder.forEach((field, fieldIndex) => {
                        let cellValue = '';
                        if (field === '?') {
                            cellValue = ''; // Campo vuoto se è '?'
                        } else if (field === 'ITA') {
                            cellValue = 'ITA'; // Inserisce ITA se richiesto
                        } else {
                            const columnIndex = field; // Uso direttamente l'indice dal fieldOrder
                            cellValue = row[columnIndex] || ''; // Ritorna il valore o vuoto

                            // Gestisce la colonna 16 per prendere solo la prima email
                            if (fieldIndex === 6 && cellValue.includes(';')) {
                                cellValue = cellValue.split(';')[0]; // Prende solo la prima email
                            }

                            // Sostituisce i ';' con uno spazio in tutti i campi
                            cellValue = cellValue.replace(/;/g, ' ');
                        }
                        rowData.push(cellValue);
                    });

                    outputData.push(rowData);
                });

                // Determina il formato di esportazione
                const exportFormat = document.getElementById('fileFormat').value;
                if (exportFormat === 'xls') {
                    const outputWorkbook = XLSX.utils.book_new();
                    const outputWorksheet = XLSX.utils.aoa_to_sheet(outputData);
                    XLSX.utils.book_append_sheet(outputWorkbook, outputWorksheet, 'Sheet 1');
                    const outputBuffer = XLSX.write(outputWorkbook, { type: 'array', bookType: 'xls' });
                    saveFile(outputBuffer, 'output_SDA.xls');
                } else if (exportFormat === 'csv') {
                    const csvContent = Papa.unparse(outputData, {
                        delimiter: ';' // Specifica il punto e virgola come delimitatore
                    });
                    saveFile(csvContent, 'output_SDA.csv');
                }
            }
        });
    };

    reader.readAsArrayBuffer(file);
}













function FedEx() {
    const fieldOrder = ['Fiorenzo Digital Teamwear', 'Fiorenzo Digital Teamwear', 'Fiorenzo Digital Teamwear', '+39 011 646 7463', 'clienti@fiorenzosport.com', 'Strada Carpice 37/6', '10024', 'TO', 'Moncalieri', 'IT', 9, 9, 15, 16, 10, 11, 'codice', 12, 'codice', 'YOUR_PACKAGING', 21, 22, 'KGS', 'EUR', 'type', 'IT', "Sportswear/Bags (SEE ATTACHED INVOICE)", 21, 22, 'KGS', 'data', 'line2', 5, 'N', 'SOLD', '?', 6, 'BUSINESS_DOCUMENT'];

    let line2 = '';
    const uniqueNumbers = [];
    const outputData = [];

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const csv = XLSX.utils.sheet_to_csv(worksheet);

        Papa.parse(csv, {
            complete: function (results) {
                // Estrae i valori unici dalla colonna 5
                results.data.forEach((row) => {
                    const column5Value = row[5];
                    if (!uniqueNumbers.includes(column5Value)) {
                        uniqueNumbers.push(column5Value);
                    }
                });

                // Header personalizzato
                outputData.push([
                    "reference", // ?
                    "senderContactName", // Fiorenzo
                    "senderCompany", // Fiorenzo Digital Teamwear
                    "senderContactNumber", // +39 011 646 7463
                    "senderEmail", // contabilita@fiorenzosport.it
                    "senderLine1", // Strada Carpice, 37/6, 10024 Moncalieri TO
                    "senderPostcode", // 10024
                    "senderState", // TO
                    "senderCity", // Moncalieri
                    "senderCountry", // IT
                    "recipientContactName", // 7 
                    "recipientCompany", // 7
                    "recipientContactNumber", // 14
                    "recipientEmail", // 15
                    "recipientLine1", // 10
                    "recipientPostcode", // 11
                    "recipientState", // 14
                    "recipientCity", // 12
                    "recipientCountry", //ITA
                    "packageType", // 01
                    "numberOfPackages", // TotNumeroColli
                    "packageWeight", // TotPesoLordo
                    "weightUnits", // KGS
                    "currencyType", // EUR
                    "serviceType", // exp = FEDEX_INTERNATIONAL_PRIORITY  | cam = FEDEX_REGIONAL_ECONOMY
                    "manufacturingCountry",
                    "itemDescription",
                    "commodityQuantity",
                    "commodityWeight",
                    "commodityMeasureUnit",
                    "shipDate",
                    "recipientLine2",
                    "invoiceNumber",
                    "etdEnabled",
                    "purposeOfShipment",
                    "senderLine2",
                    "customsValue",
                    "documentType"

                ]);


                /*
      1. electronicTradeDocuments.customsInvoiceDocument: is missing but it is required. 2. commodityInformation.commodities[0].value: is missing but it is required. 3. serviceDetails.serviceType: does not have a value in the enumeration []. 4. to[0].contact.email: does not match the email pattern must be a valid RFC 5321 Mailbox. 5. commodityInformation.commodities[0].value: Invalid value for BigDecimal: 'BONIFICO BANCARIO RICEVIMENTO FATT.'.
      
      */

                // Iniziare a iterare dalla seconda riga (indice 1)
                results.data.forEach((row, index) => {
                    // Salta la prima riga
                    if (index === 0) return;

                    const rowData = [];

                    fieldOrder.forEach((field, fieldIndex) => {
                        let cellValue = '';
                        if (field === 'data') {

                            let parts = row[0].split('/'); // Divide la data in [giorno, mese, anno]

                            let day = parts[0].padStart(2, '0');  // Assicura due cifre per il giorno
                            let month = parts[1].padStart(2, '0'); // Assicura due cifre per il mese
                            let year = parts[2].length === 2 ? '20' + parts[2] : parts[2]; // Converte '25' in '2025'

                            cellValue = year + month + day; // Unisce i valori nel formato YYYYMMDD

                            console.log(row[0]);
                            console.log(cellValue);
                        } else if (field === 10) {
                            /* se il campo è più lungo di 30 caratteri mi deve spezzettare la stringa ma in modo intelligente (non tagliando le parole), salvando in una */
                            if (row[10].length > 30) {
                                const words = row[10].split(' ');
                                let line1 = '';
                                for (let i = 0; i < words.length; i++) {
                                    if (line1.length + words[i].length < 30) {
                                        line1 += words[i] + ' ';
                                    } else {
                                        line2 += words[i] + ' ';
                                    }
                                }
                                cellValue = line1;
                            } else {
                                cellValue = row[10];
                            }





                        } else if (field === 'line2') {
                            if (line2 != '') {
                                cellValue = line2;
                            } else {
                                cellValue = '';
                            }
                        } else if (field === 'N') {
                            if (row[14].includes('SVIZZERA')) {
                                cellValue = 'Y';
                            } else {
                                cellValue = 'N';
                            }
                        }
                        else if (field === 16) {
                            // nel campo 16 c'è la email, ma è possibile che ce ne siano due, prendi la prima (le mail sono separate da punti e virgola)
                            if (row[16].includes(';')) {
                                cellValue = row[16].split(';')[0];
                            } else {
                                cellValue = row[16];
                            }
                        }
                        else if (field === '?') {
                            cellValue = ''; // Campo vuoto se è '?'
                        } else if (field == 15) {
                            cellValue = row[15].split(" ")[0];
                        } else if (field == 'YOUR_PACKAGING') {
                            if (row[19].includes('EXP')) {
                                cellValue = "FEDEX_PAK";
                            } else {
                                cellValue = "YOUR_PACKAGING";
                            }
                        } else if (field == 21) {
                            cellValue = Number(row[21]);
                        } else if (field == 22) {
                            cellValue = Number(row[22]);
                        } else if (field == 'codice') {

                            if (row[14].includes('ALBANIA')) {
                                cellValue = 'AL';
                            } else if (row[14].includes('AUSTRIA')) {
                                cellValue = 'AT';
                            } else if (row[14].includes('BELGIO')) {
                                cellValue = 'BE';
                            } else if (row[14].includes('BULGARIA')) {
                                cellValue = 'BG';
                            } else if (row[14].includes('BURKINA FASO')) {
                                cellValue = 'BF';
                            } else if (row[14].includes('REPUBBLICA CECA')) {
                                cellValue = 'CZ';
                            } else if (row[14].includes('DANIMARCA')) {
                                cellValue = 'DK';
                            } else if (row[14].includes('ESTONIA')) {
                                cellValue = 'EE';
                            } else if (row[14].includes('FINLANDIA')) {
                                cellValue = 'FI';
                            } else if (row[14].includes('FRANCIA')) {
                                cellValue = 'FR';
                            } else if (row[14].includes('GERMANIA')) {
                                cellValue = 'DE';
                            } else if (row[14].includes('GRECIA')) {
                                cellValue = 'GR';
                            } else if (row[14].includes('IRLANDA')) {
                                cellValue = 'IE';
                            } else if (row[14].includes('ITALIA')) {
                                cellValue = 'IT';
                            } else if (row[14].includes('LETTONIA')) {
                                cellValue = 'LV';
                            } else if (row[14].includes('LITUANIA')) {
                                cellValue = 'LT';
                            } else if (row[14].includes('LUSSEMBURGO')) {
                                cellValue = 'LU';
                            } else if (row[14].includes('MALTA')) {
                                cellValue = 'MT';
                            } else if (row[14].includes('NORVEGIA')) {
                                cellValue = 'NO';
                            } else if (row[14].includes('PAESI BASSI')) {
                                cellValue = 'NL';
                            } else if (row[14].includes('POLONIA')) {
                                cellValue = 'PL';
                            } else if (row[14].includes('PORTOGALLO')) {
                                cellValue = 'PT';
                            } else if (row[14].includes('REGNO UNITO')) {
                                cellValue = 'GB';
                            } else if (row[14].includes('ROMANIA')) {
                                cellValue = 'RO';
                            } else if (row[14].includes('SAN MARINO')) {
                                cellValue = 'SM';
                            } else if (row[14].includes('SERBIA')) {
                                cellValue = 'RS';
                            } else if (row[14].includes('SLOVACCHIA')) {
                                cellValue = 'SK';
                            } else if (row[14].includes('SLOVENIA')) {
                                cellValue = 'SI';
                            } else if (row[14].includes('SPAGNA')) {
                                cellValue = 'ES';
                            } else if (row[14].includes('SVIZZERA')) {
                                cellValue = 'CH';
                            } else if (row[14].includes('SVEZIA')) {
                                cellValue = 'SE';
                            } else if (row[14].includes('TURCHIA')) {
                                cellValue = 'TR';
                            } else if (row[14].includes('UNGHERIA')) {
                                cellValue = 'HU';
                            } else if (row[14].includes('UCRAINA')) {
                                cellValue = 'UA';
                            } else if (row[14].includes('ISLANDA')) {
                                cellValue = 'IS';
                            } else if (row[14].includes('CROAZIA')) {
                                cellValue = 'HR';
                            } else if (row[14].includes('BOSNIA ED ERZEGOVINA')) {
                                cellValue = 'BA';
                            } else if (row[14].includes('MACEDONIA DEL NORD')) {
                                cellValue = 'MK';
                            } else if (row[14].includes('MOLDAVIA')) {
                                cellValue = 'MD';
                            } else if (row[14].includes('MONTENEGRO')) {
                                cellValue = 'ME';
                            } else if (row[14].includes('ANDORRA')) {
                                cellValue = 'AD';
                            } else if (row[14].includes('LIECHTENSTEIN')) {
                                cellValue = 'LI';
                            } else if (row[14].includes('VATICANO')) {
                                cellValue = 'VA';
                            }

                        } else if (field == "type") {
                            if (row[19].includes('EXP')) {
                                cellValue = "FEDEX_INTERNATIONAL_PRIORITY";
                            } else if (row[19].includes('CAM')) {
                                cellValue = "FEDEX_REGIONAL_ECONOMY";
                            } else {
                                cellValue = '?';
                            }
                        } else if (typeof field === "string") {
                            cellValue = field; // Inserisce ITA se richiesto
                        } else {
                            const columnIndex = field; // Uso direttamente l'indice dal fieldOrder
                            cellValue = row[columnIndex] || ''; // Ritorna il valore o vuoto

                            // Gestisce la colonna 16 per prendere solo la prima email
                            if (fieldIndex === 6 && cellValue.includes(';')) {
                                cellValue = cellValue.split(';')[0]; // Prende solo la prima email
                            }

                            // Sostituisce i ';' con uno spazio in tutti i campi
                            cellValue = cellValue.replace(/;/g, ' ');
                        }
                        rowData.push(cellValue);
                    });

                    outputData.push(rowData);
                });

                // Determina il formato di esportazione
                const exportFormat = document.getElementById('fileFormat').value;
                if (exportFormat === 'xls') {
                    const outputWorkbook = XLSX.utils.book_new();
                    const outputWorksheet = XLSX.utils.aoa_to_sheet(outputData);
                    XLSX.utils.book_append_sheet(outputWorkbook, outputWorksheet, 'Sheet 1');
                    const outputBuffer = XLSX.write(outputWorkbook, { type: 'array', bookType: 'xls' });
                    saveFile(outputBuffer, 'output_FedEx.xls');
                } else if (exportFormat === 'csv') {
                    const csvContent = Papa.unparse(outputData, {
                        delimiter: ';' // Specifica il punto e virgola come delimitatore
                    });
                    saveFile(csvContent, 'output_FedEx.csv');
                }
            }
        });
    };

    reader.readAsArrayBuffer(file);
}





function GLS() {

    const fieldOrder = [8, 10, 12, 11, 13, 'CODICE_REGIS', 0, 21, '?', 22, 'CONTRASSEGNO?', '?', 'FRANCO?ASSEGNATO'];

    const uniqueNumbers = [];
    const outputData = [];

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const csv = XLSX.utils.sheet_to_csv(worksheet);

        Papa.parse(csv, {
            complete: function (results) {
                // Estrae i valori unici dalla colonna 5
                results.data.forEach((row) => {
                    const column5Value = row[5];
                    if (!uniqueNumbers.includes(column5Value)) {
                        uniqueNumbers.push(column5Value);
                    }
                });

                // Iniziare a iterare dalla seconda riga (indice 1)
                results.data.forEach((row, index) => {
                    // Salta la prima riga
                    if (index === 0) return;

                    const rowData = [];

                    fieldOrder.forEach((field, fieldIndex) => {
                        let cellValue = '';
                        if (field == 'CODICE_REGIS') {
                            cellValue = '1,000'.concat(row[5]);
                        } else if (field == "?") {
                            cellValue = ''; // Campo vuoto se è '?'
                        } else if (field == 'CONTRASSEGNO?') {
                            if (row[7] == 'CONTRASSEGNO') {
                                cellValue = row[6];
                            }
                        } else if (field == 'FRANCO?ASSEGNATO') {
                            if (row[18] == 'FRANCO') {
                                cellValue = 'F';
                            } else if (row[18] == 'ASSEGNATO') {
                                cellValue = 'A';
                            }
                        } else if (field == 0) {
                            let parts = row[0].split('/'); // Divide la data in [mese, giorno, anno]
                            let day = parts[1].padStart(2, '0'); // Assicura due cifre per il giorno
                            let month = parts[0].padStart(2, '0'); // Assicura due cifre per il mese
                            let year = parts[2]; // Anno rimane invariato
                            cellValue = `${day}/${month}/${year}`; // Combina i valori nel formato DD/MM/YYYY
                        } else if (field == 21) {
                            cellValue = parseFloat(row[21]).toString().replace(/\.0+$/, '');
                        } else if (field == 22) {
                            cellValue = parseFloat(row[22]).toString().replace(/\.0+$/, '');
                        } else {
                            const columnIndex = field; // Uso direttamente l'indice dal fieldOrder
                            cellValue = row[columnIndex] || ''; // Ritorna il valore o vuoto

                        }
                        rowData.push(cellValue);
                    });

                    outputData.push(rowData);
                });

                // Determina il formato di esportazione
                const exportFormat = document.getElementById('fileFormat').value;
                if (exportFormat === 'xls') {
                    const outputWorkbook = XLSX.utils.book_new();
                    const outputWorksheet = XLSX.utils.aoa_to_sheet(outputData);
                    XLSX.utils.book_append_sheet(outputWorkbook, outputWorksheet, 'Sheet 1');
                    const outputBuffer = XLSX.write(outputWorkbook, { type: 'array', bookType: 'xls' });
                    saveFile(outputBuffer, 'output_GLS.xls');
                } else if (exportFormat === 'csv') {
                    const csvContent = Papa.unparse(outputData, {
                        delimiter: ';' // Specifica il punto e virgola come delimitatore
                    });
                    saveFile(csvContent, 'output_GLS.csv');
                }
            }
        });
    };

    reader.readAsArrayBuffer(file);
}









function saveFile(content, fileName) {
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(new Blob([content]), fileName);
    } else {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([content]));
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}





function processFile() {
    const uniqueNumbers = [];

    // Ottiene il file selezionato dall'input
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    // Crea un oggetto FileReader per leggere il contenuto del file
    const reader = new FileReader();

    // Funzione chiamata quando la lettura del file è completata
    reader.onload = function (e) {
        // Ottiene il contenuto del file XLS
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Ottiene il primo foglio di lavoro
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Converte il foglio di lavoro in formato CSV
        const csv = XLSX.utils.sheet_to_csv(worksheet);

        // Utilizza la libreria PapaParse per analizzare il CSV
        Papa.parse(csv, {
            complete: function (results) {
                // Array contenente gli indici delle colonne da estrarre
                const selectedColumns = [9, 10, 11, 12, 13, 5, 7, 6, 22, 18, 21, 16, 15];
                const outputData = [];

                // Aggiungi riga vuota
                outputData.push([]);

                // Itera tutte le righe del CSV
                results.data.forEach((row, rowIndex) => {
                    const column5Value = row[6];

                    // Se il numero è già presente nell'array uniqueNumbers, salta la riga corrente
                    if (uniqueNumbers.includes(column5Value)) {
                        return;
                    }

                    // Aggiunge il numero all'array uniqueNumbers
                    uniqueNumbers.push(column5Value);
                });




                // Itera tutte le righe del CSV
                results.data.forEach((row, rowIndex) => {
                    const column5Value = row[6];
                    const column6Value = row[7];
                    const columnBEValue = row[18]; // Indice della colonna "BE" (contando da 0)

                    // Se il numero è già stato filtrato, salta la riga corrente
                    if (!uniqueNumbers.includes(column5Value) || !(row[1].includes("BRT"))) {
                        return;
                    }

                    const rowData = [];

                    selectedColumns.forEach(columnIndex => {
                        let cellValue = row[columnIndex] || '';
                        if (columnIndex === 21 || columnIndex === 22) {
                            cellValue = parseInt(cellValue, 10);
                        }
                        rowData.push(cellValue);
                    });




                    // Aggiunge i valori delle colonne 50 e 83 solo se nella colonna 50 è presente "CONTRASSEGNO"
                    if (rowIndex !== 0) {
                        if (column6Value === "CONTRASSEGNO") {
                            rowData[6] = 'TP';
                            rowData[7] = row[6];
                            if (columnBEValue === "FRANCO") {
                                rowData[9] = 4;
                            } else if (columnBEValue === "ASSEGNATO") {
                                rowData[9] = 6;
                            }
                        }
                        else if (columnBEValue === "FRANCO") {
                            rowData[9] = 1;
                            rowData[6] = '';
                            rowData[7] = '';
                        } else if (columnBEValue === "ASSEGNATO") {
                            rowData[9] = 2;
                            rowData[6] = '';
                            rowData[7] = '';
                        }
                    } else {
                        rowData[6] = rowData[8];
                        rowData[7] = row[65];
                    }

                    rowData[5] = parseInt(rowData[5]);

                    if (rowData[7] !== '') {
                        rowData[7] = parseFloat(rowData[7]);
                    }
                    else {
                        rowData[7] = '';
                    }



                    rowData.push('000');
                    rowData.push('C');
                    rowData.push('EUR');


                    // Aggiunge i valori estratti all'array dei dati di output
                    outputData.push(rowData);

                    // Rimuove il numero dall'array uniqueNumbers per evitare duplicati successivi
                    uniqueNumbers.splice(uniqueNumbers.indexOf(column5Value), 1);

                    outputData[0] = ['vabrsd', 'vabind', 'vabcad', 'vablod', 'vabprd', 'vabrmn', 'vabtic', 'vabcas', 'vabpkb', 'vabcbo', 'vabncl', 'vabemd', 'vabtrc', 'vabctr', 'vabtsp', 'vabvas'];
                });

                // Ottiene il formato di esportazione selezionato
                const exportFormat = document.getElementById('fileFormat').value;

                if (exportFormat === 'xls') {
                    // Converti l'array dei dati di output in un oggetto Workbook
                    const outputWorkbook = XLSX.utils.book_new();
                    const outputWorksheet = XLSX.utils.aoa_to_sheet(outputData);
                    XLSX.utils.book_append_sheet(outputWorkbook, outputWorksheet, 'Sheet 1');

                    // Salva il file XLS
                    const outputBuffer = XLSX.write(outputWorkbook, { type: 'array', bookType: 'xls' });
                    saveFile(outputBuffer, 'output.xls');
                } else if (exportFormat === 'csv') {
                    // Converti l'array dei dati di output in formato CSV
                    const csvContent = Papa.unparse(outputData);

                    // Salva il file CSV
                    saveFile(csvContent, 'output.csv');
                }
            }
        });
    };

    // Legge il contenuto del file come array di byte
    reader.readAsArrayBuffer(file);
}

function saveFile(content, fileName) {
    // Crea un oggetto Blob contenente il contenuto del file
    if (navigator.msSaveBlob) { // Se il browser supporta il metodo msSaveBlob (Internet Explorer)
        navigator.msSaveBlob(new Blob([content]), fileName); // Salva il file usando msSaveBlob
    } else {
        // Altrimenti, crea un link temporaneo per il download del file
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([content]));
        link.setAttribute('download', fileName);

        // Aggiunge il link al documento, lo attiva e lo rimuove successivamente
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
