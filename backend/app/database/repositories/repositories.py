from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database.repositories.base import BaseRepository
from app.database.models.models import (
    User,
    City,
    Location,
    AQIObservation,
    WeatherObservation,
    Forecast,
    Report,
    Notification,
    AIConversation
)

class UserRepository(BaseRepository[User]):
    def __init__(self, db: AsyncSession):
        super().__init__(User, db)

    async def get_by_email(self, email: str) -> Optional[User]:
        query = select(User).filter(User.email == email)
        result = await self.db.execute(query)
        return result.scalars().first()

class CityRepository(BaseRepository[City]):
    def __init__(self, db: AsyncSession):
        super().__init__(City, db)

    async def get_by_name(self, name: str) -> Optional[City]:
        query = select(City).filter(City.name == name)
        result = await self.db.execute(query)
        return result.scalars().first()

class LocationRepository(BaseRepository[Location]):
    def __init__(self, db: AsyncSession):
        super().__init__(Location, db)

class AQIRepository(BaseRepository[AQIObservation]):
    def __init__(self, db: AsyncSession):
        super().__init__(AQIObservation, db)

class WeatherRepository(BaseRepository[WeatherObservation]):
    def __init__(self, db: AsyncSession):
        super().__init__(WeatherObservation, db)

class ForecastRepository(BaseRepository[Forecast]):
    def __init__(self, db: AsyncSession):
        super().__init__(Forecast, db)

class ReportRepository(BaseRepository[Report]):
    def __init__(self, db: AsyncSession):
        super().__init__(Report, db)

class NotificationRepository(BaseRepository[Notification]):
    def __init__(self, db: AsyncSession):
        super().__init__(Notification, db)

class ConversationRepository(BaseRepository[AIConversation]):
    def __init__(self, db: AsyncSession):
        super().__init__(AIConversation, db)
