from getpass import getpass
from sqlalchemy.orm import Session
from database import engine
from models import User
from security import hash_password

email = input("Admin email: ").strip().lower()
password = getpass("Admin password: ")
confirm = getpass("Confirm password: ")

if not email or not password:
    print("Email and password cannot be empty.")
elif password != confirm:
    print("Passwords do not match.")
else:
    db = Session(engine)
    try:
        existing = db.query(User).filter(User.email == email).first()

        if existing:
            print("This email already exists. No account created.")
        else:
            admin = User(
                email=email,
                hashed_password=hash_password(password),
                role="admin",
                is_active=True,
            )
            db.add(admin)
            db.commit()
            print("Admin account created successfully!")
    finally:
        db.close()
