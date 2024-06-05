@isTest
public class MultipleRecordsControllerTest {

    @isTest
    static void testConstructorWithMobileNumber() {
        // Set up the test data
        String testMobileNumber = '1234567890';

        // Set the parameters for the current page
        Map<String, String> parameters = new Map<String, String>();
        parameters.put('MobileNumber', testMobileNumber);
        Test.setCurrentPageReference(new PageReference('/apex/TestPage'));
        ApexPages.currentPage().getParameters().putAll(parameters);

        // Instantiate the controller
        MultipleRecordsController controller = new MultipleRecordsController();

        // Verify the controller's MobileNumber property
        System.assertEquals(testMobileNumber, controller.MobileNumber, 'The MobileNumber property should match the test mobile number.');
    }

    @isTest
    static void testConstructorWithoutMobileNumber() {
        // Set the parameters for the current page (without MobileNumber)
        Map<String, String> parameters = new Map<String, String>();
        Test.setCurrentPageReference(new PageReference('/apex/TestPage'));
        ApexPages.currentPage().getParameters().putAll(parameters);

        // Instantiate the controller
        MultipleRecordsController controller = new MultipleRecordsController();

        // Verify the controller's MobileNumber property is null
        System.assertEquals(null, controller.MobileNumber, 'The MobileNumber property should be null when no MobileNumber parameter is provided.');
    }
}