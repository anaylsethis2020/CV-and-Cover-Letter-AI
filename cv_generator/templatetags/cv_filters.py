from django import template
from django.utils.safestring import mark_safe
import json

register = template.Library()

@register.filter
def split(value, delimiter=','):
    """Split a string by the given delimiter"""
    if not value:
        return []
    return [item.strip() for item in str(value).split(delimiter)]

@register.filter
def strip(value):
    """Strip whitespace from a string"""
    if not value:
        return ''
    return str(value).strip()

@register.filter
def to_json(value):
    """Convert a Python object to JSON"""
    return mark_safe(json.dumps(value))

@register.filter
def get_item(dictionary, key):
    """Get an item from a dictionary"""
    if not dictionary:
        return None
    return dictionary.get(key)

@register.filter
def length_is(value, length):
    """Check if value length equals given length"""
    try:
        return len(value) == int(length)
    except (ValueError, TypeError):
        return False

@register.filter
def default_if_none(value, default):
    """Return default if value is None"""
    return value if value is not None else default 