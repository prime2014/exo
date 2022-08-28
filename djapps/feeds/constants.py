from enum import Enum, unique


@unique
class LikeChoice(Enum):
    Like = 0
    Love = 0
    Haha = 0
    Wow = 0
    Sad = 0
    Angry = 0


if __name__ == "__main__":
    print(LikeChoice.__members__.items())
