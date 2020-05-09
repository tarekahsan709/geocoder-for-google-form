function doGet() {
    return HtmlService.createHtmlOutputFromFile('index');
}

function saveLocation(positionData) {
    var formDestId = FormApp.getActiveForm().getDestinationId();
    var spreadSheet = SpreadsheetApp.openById(formDestId);
    var respSheet = spreadSheet.getSheets()[0];

    var data = respSheet.getDataRange().getValues();
    var headers = data[0];
    var numColumns = headers.length;
    var numResponses = data.length;

    var latitude = positionData[0];
    var longitude = positionData[1];
    var accuracy = positionData[2];
    var address = latitude + "," + longitude + "," + accuracy;

    if (respSheet.getRange(1, numColumns).getValue() == "GeoAddress") {
        //Time here is Bangladesh, you may need to change time to your local time (in GMT)
        if (respSheet.getRange(numResponses, numColumns - 2).getValue() == "" && respSheet.getRange(numResponses - 1, numColumns - 2).getValue() != "") {
            respSheet.getRange(numResponses, numColumns - 2).setValue(Utilities.formatDate(new Date(), "GMT+6", "MM/dd/yyyy HH:mm:ss"));
            respSheet.getRange(numResponses, numColumns - 1).setValue(address);

            var response = Maps.newGeocoder().reverseGeocode(latitude, longitude);
            var formattedAddress = response.results[0].formatted_address;
            respSheet.getRange(numResponses, numColumns).setValue(formattedAddress);
        }
    } else if (respSheet.getRange(1, numColumns).getValue() != "GeoAddress") {
        //create labels in first row
        respSheet.getRange(1, numColumns + 1).setValue("GeoStamp");
        respSheet.getRange(1, numColumns + 2).setValue("GeoCode");
        respSheet.getRange(1, numColumns + 3).setValue("GeoAddress");
        //fill data for first respondent

        if (numResponses == 2) {
            respSheet.getRange(numResponses, numColumns + 1).setValue(Utilities.formatDate(new Date(), "GMT+6", "MM/dd/yyyy HH:mm:ss"));
            respSheet.getRange(numResponses, numColumns + 2).setValue(address);
            var response = Maps.newGeocoder().reverseGeocode(latitude, longitude);
            var formattedAddress = response.results[0].formatted_address;
            respSheet.getRange(numResponses, numColumns + 3).setValue(formattedAddress);
        } else if (numResponses > 2) {
            respSheet.getRange(numResponses, numColumns + 1).setValue(Utilities.formatDate(new Date(), "GMT+6", "MM/dd/yyyy HH:mm:ss")).setFontColor("red");
            respSheet.getRange(numResponses, numColumns + 2).setValue(address).setFontColor("red");
            var response = Maps.newGeocoder().reverseGeocode(latitude, longitude);
            var formattedAddress = response.results[0].formatted_address;
            respSheet.getRange(numResponses, numColumns + 3).setValue(formattedAddress).setFontColor("red");
        }
    }

}
