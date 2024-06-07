/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 06-07-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public class MultipleRecordsController {
    public List<Lead> records { get; set; }
    public String selectedRecordId { get; set; }
    public Lead selectedRecord { get; set; }
    public List<SelectOption> recordOptions { get; set; }
    public String MobileNumber { get; set; }
    public MultipleRecordsController() {
        system.debug('called MultipleRecordsController1');
        // Retrieve the mobile number from the URL parameters
        MobileNumber = ApexPages.currentPage().getParameters().get('MobileNumber');
        recordOptions = new List<SelectOption>();
        if (MobileNumber != null) {
            system.debug('Phone --------' + MobileNumber);
            String soslQueryString = 'FIND \'' + MobileNumber + '\' IN PHONE FIELDS RETURNING Lead(Id, Name, Phone)'; // Search within Lead objects
            system.debug('soslQueryString ------------' + soslQueryString);
            List<List<SObject>> searchList = search.query(soslQueryString);
            // Flatten the list of lists into a single list of Leads
            records = new List<Lead>();
            for (SObject sObj : searchList[0]) {
                records.add((Lead)sObj);
            }
            system.debug('records ------------' + records);
            // Initialize record options based on the records retrieved
            for (Lead record : records) {
                recordOptions.add(new SelectOption(record.Id, record.Name));
            }
        }
    }
    public PageReference selectRecord() {
        if (selectedRecordId != null) {
            for (Lead record : records) {
                if (record.Id == selectedRecordId) {
                    selectedRecord = record;
                    break;
                }
            }
        }
        return null; // Stay on the same page
    }
}