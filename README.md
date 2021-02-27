# This is project4 from Incode 

# Participants:

Stan
Jake
Ahmad

# To delete newly added users from database using Terminal:

psql -U project4admin project4db
(enter password 'Project4' if asked)
DELETE FROM users WHERE id > 3;