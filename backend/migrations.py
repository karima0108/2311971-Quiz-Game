
from sqlalchemy import inspect, text


def migrate_group_owner_column(engine):
    inspector = inspect(engine)

    if "groups" not in inspector.get_table_names():
        return

    columns = [
        column["name"]
        for column in inspector.get_columns("groups")
    ]

    with engine.begin() as connection:
        if "owner_id" not in columns:
            connection.execute(
                text(
                    "ALTER TABLE groups "
                    "ADD COLUMN owner_id INTEGER "
                    "REFERENCES users(id) ON DELETE SET NULL"
                )
            )

        connection.execute(
            text(
                "CREATE INDEX IF NOT EXISTS "
                "ix_groups_owner_id ON groups (owner_id)"
            )
        )
