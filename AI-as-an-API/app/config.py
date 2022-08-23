import os
from functools import lru_cache
from pydantic import BaseSettings, Field


os.environ['CQLENG_ALLOW_SCHEMA_MANAGEMENT'] = '1'

class Settings(BaseSettings):
    aws_access_key_id: str = None
    aws_secret_access_key: str = None
    db_client_id: str = "BUifpIFTfyCBEmsZFChFCQIg"
    db_client_secret: str = "WHD-Zy805zTFKrMokAdP2,Ng0-6a6Y02RUyFXbbhdOeJ+SPe9sHjZq0GQdf6ZMryU1cjfccXPdwKr265So4WqJDReiJMx+.vUsM,OK-cQ+nzBv1Dm2ut749cy88jqtdi"

    class Config:
        env_file = '.env'


@lru_cache
def get_settings():
    return Settings()