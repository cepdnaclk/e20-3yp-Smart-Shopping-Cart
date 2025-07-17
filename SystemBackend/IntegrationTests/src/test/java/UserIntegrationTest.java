import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.junit.jupiter.api.*;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

class UserIntegrationTest {

    static final String BASE_URL = "http://localhost:4020/api"; // adjust port if needed
    static String adminUsername = "ADMIN63"; // change to match your seeded admin
    static String adminPassword = "qs%Uc45k"; // change to your seeded admin password

    @BeforeAll
    static void setup() {
        RestAssured.baseURI = BASE_URL;
    }

    @Test
    void registerAndLogin_Success() {
        // 1. Login as admin to get JWT
        String adminLoginPayload = String.format("""
            {
              "username": "%s",
              "password": "%s"
            }
            """, adminUsername, adminPassword);

        Response adminLoginResponse = given()
                .contentType("application/json")
                .body(adminLoginPayload)
                .post("/user/auth/login")
                .then()
                .statusCode(200)
                .body("access_token", notNullValue())
                .extract()
                .response();

        String adminToken = adminLoginResponse.jsonPath().getString("access_token");

        // 2. Register a new user using the admin token
        String registerPayload = """
            {
              "firstName": "Janidu",
              "lastName": "Ranawaka",
              "email": "integrationtestuser@email.com",
              "phoneNumber": "0712345678",
              "nic": "ITNIC12345",
              "role": "STAFF"
            }
            """;

        Response registerResponse = given()
                .contentType("application/json")
                .header("Authorization", "Bearer " + adminToken)
                .body(registerPayload)
                .post("/user/profile/register")
                .then()
                .log().all() // 👈 This prints request & response details to your console
                .extract()
                .response();

        System.out.println("Registration response code: " + registerResponse.statusCode());
        System.out.println("Registration response body: " + registerResponse.asString());

        Assertions.assertEquals(200, registerResponse.statusCode(), "Registration did not return 200!");

        // Parse returned username and password from the response
        String registerMsg = registerResponse.asString();
        Assertions.assertTrue(registerMsg.contains("Registered successfully"));

        String username = extractBetween(registerMsg, "username: ", " and password");
        String password = extractAfter(registerMsg, "password: ");

        // 3. Login as the new user (no auth header needed)
        String loginPayload = String.format("""
            {
              "username": "%s",
              "password": "%s"
            }
            """, username, password);

        given()
                .contentType("application/json")
                .body(loginPayload)
                .when()
                .post("/user/auth/login")
                .then()
                .log().all()
                .statusCode(200)
                .body("access_token", notNullValue())
                .body("refresh_token", notNullValue())
                .body("role", equalTo("STAFF"))
                .body("message", equalTo("Login successful"));
    }

    @Test
    void registerAndDeleteUser_Success() {
        // 1. Login as admin to get JWT
        String adminLoginPayload = String.format("""
        {
          "username": "%s",
          "password": "%s"
        }
        """, adminUsername, adminPassword);

        Response adminLoginResponse = given()
                .contentType("application/json")
                .body(adminLoginPayload)
                .post("/user/auth/login")
                .then()
                .statusCode(200)
                .body("access_token", notNullValue())
                .extract()
                .response();

        String adminToken = adminLoginResponse.jsonPath().getString("access_token");

        // 2. Register a new user
        String registerPayload = """
        {
          "firstName": "DeleteMe",
          "lastName": "TestUser",
          "email": "deletetestuser@email.com",
          "phoneNumber": "0712999999",
          "nic": "DELTEST1234",
          "role": "STAFF"
        }
        """;

        Response registerResponse = given()
                .contentType("application/json")
                .header("Authorization", "Bearer " + adminToken)
                .body(registerPayload)
                .post("/user/profile/register")
                .then()
                .statusCode(200)
                .extract()
                .response();

        String registerMsg = registerResponse.asString();
        Assertions.assertTrue(registerMsg.contains("Registered successfully"));

        String username = extractBetween(registerMsg, "username: ", " and password");

        // 3. Admin deletes the user
        Response deleteResponse = given()
                .header("Authorization", "Bearer " + adminToken)
                .queryParam("username", username)
                .delete("/user/profile/delete")
                .then()
                .log().all() // See what the API returns
                .extract()
                .response();

        System.out.println("Delete response code: " + deleteResponse.statusCode());
        System.out.println("Delete response body: " + deleteResponse.asString());

        Assertions.assertEquals(200, deleteResponse.statusCode(), "User delete did not return 200!");
        Assertions.assertTrue(deleteResponse.asString().contains("User deleted successfully"), "Delete message not found");

        // 4. Attempt login as deleted user (should fail)
        String loginPayload = String.format("""
            {
              "username": "%s",
              "password": "someWrongPassword" // doesn't matter, user is deleted
            }
            """, username);

                given()
                        .contentType("application/json")
                        .body(loginPayload)
                        .post("/user/auth/login")
                        .then()
                        .statusCode(500); // Or whatever your API returns for "user not found"

    }

    @Test
    void getProfileAndRole_Success() {
        // 1. Login as admin and register a new user
        String adminLoginPayload = String.format("""
            {
              "username": "%s",
              "password": "%s"
            }
            """, adminUsername, adminPassword);

        Response adminLoginResponse = given()
                .contentType("application/json")
                .body(adminLoginPayload)
                .post("/user/auth/login")
                .then()
                .statusCode(200)
                .body("access_token", notNullValue())
                .extract()
                .response();

        String adminToken = adminLoginResponse.jsonPath().getString("access_token");

        String registerPayload = """
            {
              "firstName": "Janidu",
              "lastName": "Ranawaka",
              "email": "integrationtestuser@email.com",
              "phoneNumber": "0712345678",
              "nic": "ITNIC12345",
              "role": "STAFF"
            }
            """;

        Response registerResponse = given()
                .contentType("application/json")
                .header("Authorization", "Bearer " + adminToken)
                .body(registerPayload)
                .post("/user/profile/register")
                .then()
                .log().all() // 👈 This prints request & response details to your console
                .extract()
                .response();

        // Parse returned username and password from the response
        String registerMsg = registerResponse.asString();
        Assertions.assertTrue(registerMsg.contains("Registered successfully"));

        String username = extractBetween(registerMsg, "username: ", " and password");
        String password = extractAfter(registerMsg, "password: ");


        // ... after registration and getting username/password, login as that new user:
        String loginPayload = String.format("""
        {
          "username": "%s",
          "password": "%s"
        }
        """, username, password);

        Response loginResponse = given()
                .contentType("application/json")
                .body(loginPayload)
                .post("/user/auth/login")
                .then()
                .statusCode(200)
                .extract()
                .response();

        String userToken = loginResponse.jsonPath().getString("access_token");

        // 2. GET user profile info
        Response profileResponse = given()
                .header("Authorization", "Bearer " + userToken)
                .when()
                .get("/user/profile/get")
                .then()
                .statusCode(200)
                .body("firstName", equalTo("Janidu"))
                .body("lastName", equalTo("Ranawaka"))
                .body("role", equalTo("STAFF"))
                .extract().response();

        System.out.println("User Profile Info: " + profileResponse.asString());

        // 3. GET user role
        Response roleResponse = given()
                .header("Authorization", "Bearer " + userToken)
                .when()
                .get("/user/profile/role")
                .then()
                .statusCode(200)
                .body("role", equalTo("STAFF"))
                .extract().response();

        System.out.println("User Role Info: " + roleResponse.asString());
    }



    // Utility functions to extract username and password
    private static String extractBetween(String text, String start, String end) {
        int s = text.indexOf(start) + start.length();
        int e = text.indexOf(end);
        return text.substring(s, e).trim();
    }
    private static String extractAfter(String text, String marker) {
        int i = text.lastIndexOf(marker) + marker.length();
        return text.substring(i).trim();
    }
}
