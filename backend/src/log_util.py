import logging
from logging import Logger


def get_logger(module_name: str) -> Logger:
    # Create a logger
    logger = logging.getLogger(module_name)
    logger.setLevel(logging.INFO)

    # Create a handler and set its level
    handler = logging.FileHandler("app.log")
    handler.setLevel(logging.INFO)

    # Create a formatter and add it to the handler
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    handler.setFormatter(formatter)

    # Add the handler to the logger
    logger.addHandler(handler)

    return logger
