
//Quellen: https://developer.mozilla.org/en-US/docs/Web/API/URL/URL

//Konfigurationsdatei mit allen URLs zum Backend die benutzt werden:
export const AUTH_URL : URL = new URL("https://localhost:443/api/authenticate");
export const USER_URL : URL = new URL("https://localhost:443/api/users");
export const DEGREE_COURSE_URL : URL = new URL("https://localhost:443/api/degreeCourses");
export const DEGREE_COURSE_APPLICATION_URL : URL = new URL("https://localhost:443/api/degreeCourseApplications");
export const DEGREE_COURSE_MY_APPLICATION_URL : URL = new URL("https://localhost:443/api/degreeCourseApplications/myApplications");