from app.models.user import UserModel
from app.schemas.user import UserRegister
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

async def get_user_by_email(db: AsyncSession, email: str) -> UserModel | None:
    result = await db.execute(select(UserModel).where(UserModel.email == email))
    return result.scalar_one_or_none()

async def get_user_by_id(db: AsyncSession, user_id: int) -> UserModel | None:
    result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    return result.scalar_one_or_none()

async def get_user_by_username(db: AsyncSession, username: str) -> UserModel | None:
    result = await db.execute(select(UserModel).where(UserModel.username == username))
    return result.scalar_one_or_none()

async def register(
    db: AsyncSession,
    username: str,
    email: str,
    password: str,
    fullname: str | None = None
) -> UserModel:

    new_user = UserModel(
        username=username,
        email=email,
        password=password,
        fullname=fullname
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user

async def update_user(
    db: AsyncSession,
    user: UserModel,
    data: dict
) -> UserModel:

    for key, value in data.items():
        setattr(user, key, value)

    await db.commit()
    await db.refresh(user)

    return user

async def update_user(db: AsyncSession, user_id: int, data: dict):
    result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        return None
    for key, value in data.items():
        setattr(user, key, value)
    await db.commit()
    await db.refresh(user)
    return user

async def delete_user(db: AsyncSession, user: UserModel):
    await db.delete(user)
    await db.commit()

async def get_all_users(db: AsyncSession):
    result = await db.execute(select(UserModel))
    return result.scalars().all()



