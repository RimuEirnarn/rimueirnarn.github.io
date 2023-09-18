from bs4 import BeautifulSoup
from pathlib import Path

MAIN_PATH = "./main.html"
OUTPUT = "./compact.html"
COMPONENT_PATH = Path("components")
MAIN_COMPS = ['main.html', 'terminal.html', 'card.html']
APP = "#app"
BACKUP_APP = "#app-backup"

def read():
    for comp in MAIN_COMPS:
        with open(COMPONENT_PATH / comp, encoding='utf-8') as file:
            yield comp, file.read()


def main():
    print("Processing automatic patching.")

    with open(MAIN_PATH, encoding='utf-8') as file:
        main = BeautifulSoup(file.read(), features="html.parser")

    app = main.select_one(APP)
    bapp = main.select_one(BACKUP_APP)

    if not app:
        raise ValueError(f"{APP} returned None")

    if not bapp:
        raise ValueError(f"{BACKUP_APP} returned None")

    for name, comp in read():
        if name == "main.html":
            # For whatever reason, main.html is default.
            data = BeautifulSoup(comp, features="html.parser")
            app.append(data)
        data = BeautifulSoup(f"<div id='pr-{name.split('.')[0]}'>{comp}</div>", features="html.parser")
        bapp.append(data)

    with open(OUTPUT, 'w') as file:
        file.write(str(main))
    print("Done")

if __name__ == "__main__":
    main()
