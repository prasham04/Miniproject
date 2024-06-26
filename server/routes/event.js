import express from "express";
import bcrypt from "bcrypt";
import db from "../config/database.js";

const router = express.Router();

router.get("/api/events", async (req, res) => {
    try {
      const { rows } = await db.query("SELECT * FROM events");
      const updatedEvents = await Promise.all(
        rows.map(async (event) => {
          const acceptedAlumniResult = await db.query(
            `SELECT users.username, alumnus.aid FROM manageevents JOIN alumnus ON manageevents.aid_fk = alumnus.aid JOIN users ON alumnus.uid = users.uid WHERE eid_fk = $1 AND acceptance = true`,[event.eid]);
  
          // Destructuring for Conciseness
          const { rows: acceptedAlumni } = acceptedAlumniResult;
  
          // Return event with acceptedAlumni (including aid for potential use)
          return { ...event, acceptedAlumni };
        })
      );
  
      res.json(updatedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });
  
router.post("/api/events", async (req, res) => {
    const { title, date, location, description, seats,location_link} = req.body;
    try {
      const { rows } = await db.query(
        "INSERT INTO events (title, date,location, description, seats,registeredStudents,location_link) VALUES ($1, $2, $3, $4,$5,0,$6) RETURNING *;",
        [title, date,location, description, seats,location_link]
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error("Error adding event:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });
  
// router.delete("/api/events/:id", async (req, res) => {
//     const eventId = req.params.id;
//     try {
//       await db.query("DELETE FROM events WHERE eid = $1", [eventId]);
//       res.sendStatus(204);
//     } catch (error) {
//       console.error("Error deleting event:", error);
//       res.status(500).json({ error: "An unexpected error occurred" });
//     }
//   });
  router.put("/api/events/:eventId/register", async (req, res) => {
    const eventId = req.params.eventId;
    const {sid} =req.body;
    try {
      // Check if user is already registered for the event
    const existingRegistration = await db.query("SELECT * FROM register WHERE eid_fk = $1 AND sid_fk = $2", [eventId, sid]);
    if (existingRegistration.rows.length > 0) {
      console.log("user is already registered for the event");
      return res.status(400).json({ error: "User is already registered for this event." });
    }

    // If user is not registered, update registeredStudents count and add entry in register table
    console.log("Received request to register for event with ID:", eventId);
    const result=await db.query("UPDATE events SET registeredstudents = registeredstudents + 1 WHERE eid = $1", [eventId]);
    await db.query("INSERT INTO register (eid_fk, sid_fk) VALUES ($1, $2)", [eventId, sid]);
    console.log("Database update result:", result);
    res.sendStatus(200);
    } catch (error) {
      console.error("Error registering for event:", error);
      res.status(500).send('Error registering for event');
    }
  });

  router.get("/api/events/alumni", async (req, res) => {
    try {
      const { rows } = await db.query("SELECT users.uid,username,email,role,aid,experience_years FROM alumnus join users on alumnus.uid=users.uid");
      console.log(rows);
      res.json(rows);
    } catch (error) {
      console.error("Error fetching alumni:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });
  

  export default router;