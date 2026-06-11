from math import radians
from math import sin
from math import cos
from math import sqrt
from math import atan2

EARTH_RADIUS = 6371


def haversine_distance(
    lat1,
    lon1,
    lat2,
    lon2
):

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        +
        cos(radians(lat1))
        *
        cos(radians(lat2))
        *
        sin(dlon / 2) ** 2
    )

    c = 2 * atan2(
        sqrt(a),
        sqrt(1 - a)
    )

    return EARTH_RADIUS * c


PRICE_PER_KM = 500


def calculate_price(distance):

    return round(distance * PRICE_PER_KM)