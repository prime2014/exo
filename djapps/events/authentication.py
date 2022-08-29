from django_eventstream.channelmanager import DefaultChannelManager
import logging


logger = logging.getLogger(__name__)


class MyChannelManager(DefaultChannelManager):
    def can_read_channel(self, user, channel):
        logger.info("EVENTSTREAM USER: %s" % user)
        # require auth for channels
        if channel.startswith("user") and user is None:
            return False
        return True
