from setuptools import setup

setup(name='pycoffee',
      version=0.2,
      description="Python backend for a lean coffee service",
      url="http://serialized.net",
      author="Joshua Barratt",
      author_email="jbarratt@serialized.net",
      license="MIT",
      packages=["pycoffee"],
      install_requires=[
          'boto3',
          'pynamodb',
      ],
      setup_requires=['pytest-runner'],
      tests_require=['pytest'],
      zip_safe=False)
