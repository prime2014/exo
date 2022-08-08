from pickle import NONE
import pytest
from rest_framework.test import APIClient
import logging
import json

logger = logging.getLogger(__name__)


credentials = {
    "email": "deckerd@show.com",
    "password": "deckeredshow",
    "avatar": None,
    "username": "Deckered",
    "firstname": "Deckered",
    "lastname": "Show",
    "is_active": True,
    "meta": None
}


@pytest.mark.django_db(transaction=True)
def test_signup():
    client = APIClient()
    resp = client.post("/accounts/api/v1/users/", data=credentials, format="json")
    logger.info("CALL LOG: %s" % resp.get("data"))
    assert resp.status_code == 201
