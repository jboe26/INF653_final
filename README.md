### US States REST API
### Project Description
This project is a Node.js REST API for accessing and managing US state data. The API integrates with both a static JSON file for general state information and a MongoDB database for dynamic fun facts about specific states. It adheres to the INF653 Back End Web Development final project rubric.

### Features
Retrieve detailed information about all US states or specific states.

Query contiguous or non-contiguous states.

Manage dynamic "fun facts" for states through CRUD operations.

Catch-all error handling for invalid routes.

Hosted on Glitch for public accessibility.

### Technologies Used
Node.js

Express.js

MongoDB with Mongoose

Glitch for deployment

Postman (for API testing)

dotenv for environment variable management

### API Endpoints
### GET Requests
# Endpoint	Description
/states/	Returns all state data (merged from statesData.json and MongoDB funfacts).
/states/?contig=true	Returns data for contiguous states (excludes Alaska and Hawaii).
/states/?contig=false	Returns data for non-contiguous states (Alaska and Hawaii).
/states/:state	Returns data for a specific state (by state abbreviation).
/states/:state/funfact	Returns a random fun fact for the specified state.
/states/:state/capital	Returns the capital of the specified state.
/states/:state/nickname	Returns the nickname of the specified state.
/states/:state/population	Returns the population of the specified state.
/states/:state/admission	Returns the admission date of the specified state.
### POST Request
# Endpoint	Description
/states/:state/funfact	Adds one or more fun facts to the specified state.
### PATCH Request
# Endpoint	Description
/states/:state/funfact	Updates a specific fun fact for the specified state (by index).
### DELETE Request
# Endpoint	Description
/states/:state/funfact	Deletes a specific fun fact for the specified state (by index).

### Challenges & Solutions
Dynamic Data Integration: Merging data from statesData.json and MongoDB required careful mapping to ensure consistency.

Error Handling: Implementing robust 404 responses and validating client inputs.

Deployment: Ensuring environment variables were securely managed during deployment on Glitch.