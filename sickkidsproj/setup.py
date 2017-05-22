from setuptools import setup


setup(
        name='sickkidsproj',
        packages=['sickkidsproj'],
        include_package_data=True,
        install_requires=[
            'flask',
            'SQLAlchemy',
            ],
        )
