import pytest
from rest_framework.test import APIRequestFactory
import requests, logging
from django.test import Client


logger = logging.getLogger(__name__)


credentials = {
    "email": "abc@net.com",
    "password": "abc@net",
    "username": "abc7craze",
    "firstname": "abc",
    "lastname": "def",
    "is_active": True
}


@pytest.mark.django_db(transaction=True)
def test_signup():
    client = APIRequestFactory()
    response = client.post("/accounts/api/v1/users/", data=credentials, format="json")
    logger.info(response)
