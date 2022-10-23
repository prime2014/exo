import pytest
from rest_framework.test import APIClient
import logging


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
    resp = client.post("/accounts/api/v1/auth/", data=credentials, format="json")
    logger.info("CALL LOG: %s" % resp.get("data"))
    assert resp.status_code == 201


# @pytest.mark.parametrize("email, password", [
#     ("deckerd@show.com", "deckeredshow")
# ])
# @pytest.mark.django_db(transaction=True)
# def test_login(email, password):
#     client = APIClient()
#     resp = client.post("/accounts/auth/login/", headers={"Content-Type": "application/json"},
#                        data={"email": email, "password": password})
#     logger.info(resp.data)
#     assert resp.data["user"] == credentials
#     assert resp.status_code == 200
