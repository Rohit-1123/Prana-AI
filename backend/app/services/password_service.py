from app.security.security import verify_password, get_password_hash

class PasswordService:
    @staticmethod
    def hash_password(password: str) -> str:
        return get_password_hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return verify_password(plain_password, hashed_password)

    @staticmethod
    def validate_password_strength(password: str) -> bool:
        """Enforces password validation rules (length >= 8)."""
        return len(password) >= 8
