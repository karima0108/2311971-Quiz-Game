
import hashlib
import hmac
import os

from dotenv import load_dotenv
from pwdlib import PasswordHash

load_dotenv()

PASSWORD_PEPPER = os.getenv("PASSWORD_PEPPER")

if not PASSWORD_PEPPER:
    raise RuntimeError("PASSWORD_PEPPER is not configured")

password_hash = PasswordHash.recommended()


def _pepper_password(password: str) -> str:
    return hmac.new(
        PASSWORD_PEPPER.encode("utf-8"),
        password.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def hash_password(password: str) -> str:
    return password_hash.hash(_pepper_password(password))


def verify_password_and_update(
    plain_password: str,
    hashed_password: str,
) -> tuple[bool, str | None]:

    # First check passwords hashed with the new pepper method.
    if password_hash.verify(
        _pepper_password(plain_password),
        hashed_password,
    ):
        return True, None

    # Backward compatibility: check old Argon2 hashes.
    if password_hash.verify(
        plain_password,
        hashed_password,
    ):
        # Upgrade the old hash using the new pepper.
        return True, hash_password(plain_password)

    return False, None


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    valid, _ = verify_password_and_update(
        plain_password,
        hashed_password,
    )
    return valid
