import bcrypt

def hash_password(password: str) -> str:
    """Hash un mot de passe et retourne une string pour MongoDB"""
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Vérifie un mot de passe contre son hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))