from string import Template


def format(string: str, mapping: dict[str, str]):
    return Template(string).safe_substitute(mapping)

