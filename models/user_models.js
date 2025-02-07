const pool = require("../config/database_connection.js")
module.exports = {
create: (data, callBack) => {
    //Check if the user with the same id already exists
    pool.query(
      `SELECT * FROM users_data WHERE id = ?`,
      [data.id],
      (checkError, checkResults) => {
        if (checkError) {
          return callBack(checkError, null); 
        }

        //check If the user with the same id exists, return an error message
        if (checkResults.length > 0) {
          return callBack(null, {
            msg: "This user is already registered.", // Message when user already registered
            duplicate: true,
          });
        }

        //Check If no duplicate is found, proceed with the INSERT operation
        pool.query(
          `INSERT INTO users_data (first_name, last_name, email, password) VALUES (?, ?, ?, ?)`,
          [
            data.first_name,
            data.last_name,
            data.email,
            data.password,
    
          ],
          (error, results) => {
            if (error) {
              return callBack(error, null); // Pass the error to the callback if any error occurs during insertion
            } else {
              return callBack(null, {
                msg: "You have registered successfully...",
               
              });
            }
          }
        );
      }
    );
  },
  get_users: (callBack) => {
    pool.query(
      `SELECT * FROM users_data`,
      (error, results, fields) => {
        if (error) {
          return callBack(error); 
        }
        
        return callBack(null, results);
      }
    );
  },

  update_user :(userId, newUserData, callBack) => {
    if (!newUserData || !newUserData.first_name || !newUserData.last_name || !newUserData.email || !newUserData.password) {
        return callBack({ message: "Missing required fields in update data" });
    }

    const query = `
        UPDATE users_data 
        SET first_name = ?, last_name = ?, email = ?, password = ? 
        WHERE id = ?
    `;
    
    const values = [
        newUserData.first_name, 
        newUserData.last_name, 
        newUserData.email, 
        newUserData.password,
        userId
    ];

    pool.query(query, values, (error, results) => {
        if (error) {
            return callBack(error); 
        }

        if (results.affectedRows === 0) {
            return callBack(null, { success: 0, message: 'User not found!' });
        }

        return callBack(null, { success: 1, message: 'User updated successfully!' });
    });
},
getUserByEmail: (email, callback) => {
  const query = `SELECT * FROM users_data WHERE email = ?`;
  pool.query(query, [email], (error, results) => {
      if (error) {
          console.error("Database error:", error);
          return callback(error);
      }
      if (results.length === 0) {
          console.log("No user found with email:", email);
          return callback(null, null); // No user found
      }
      console.log("User data retrieved:", results[0]); // Log retrieved user
      return callback(null, results[0]);
  });
}

}