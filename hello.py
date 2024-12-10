MENU = {
    "espresso": {
        "ingredients": {
            "water": 50,
            "coffee": 18,
        },
        "cost": 1.5,
    },
    "latte": {
        "ingredients": {
            "water": 200,
            "milk": 150,
            "coffee": 24,
        },
        "cost": 2.5,
    },
    "cappuccino": {
        "ingredients": {
            "water": 250,
            "milk": 100,
            "coffee": 24,
        },
        "cost": 3.0,
    }
}

resources = {
    "water": 300,
    "milk": 200,
    "coffee": 100,
}

# TODO: create Interface

machine_status = True
need_cost = 0

def report_resource():
    print(f"Water: {resources['water']}ml")
    print(f"Milk: {resources['milk']}ml")
    print(f"Coffee: {resources['coffee']}g")
    print(f"Money: $0")

def turn_off_machine():
    global machine_status
    machine_status = False
    print(machine_status)

def check_resource(coffee):
    need_resource = MENU[coffee]['ingredients']
    for value in need_resource:
        if need_resource[value] > resources[value]:
            return print(f"Sorry there is not enough {value}")

    global need_cost
    print('please insert coins')
    need_cost = MENU[coffee]['cost']

def calculate_coin():
    quarters = float(input("how many quarters?: ")) * 0.25
    dimes = float(input("how many dimes?: ")) * 0.10
    nickles = float(input("how many nickles?: ")) * 0.05
    pennies = float(input("how many pennies?: ")) * 0.01

    return quarters + dimes + nickles + pennies

def make_coffee(coffee):
    check_resource(coffee)

def register(cost, user_money):
    resources["Money"] = f"${cost}"
    changes = user_money - cost
    print(f"Here is ${round(changes, 2)} dollars in change")

def start_making_coffee(order):
    global resources
    item = MENU[order]['ingredients']
    for key in item:
        resources[key] -= item[key]

    print(f"Here is Your {order}. Enjoy!!")

def coffee_control(keyword):
    if keyword == "off":
        turn_off_machine()
    elif keyword == "report":
        report_resource()
    elif keyword == "latte" or "espresso" or "cappuccino":
        make_coffee(keyword)
        return keyword
    else:
        print("Please input the right keyword")

while machine_status:
    what_to_do = input("What would you like? (espresso/latte/cappuccino): ")

    keyword = coffee_control(what_to_do)
    client_money = calculate_coin()

    if need_cost > client_money:
        print("Sorry that's not enough money. Money refunded.")
    else:
        register(need_cost, client_money)

    start_making_coffee(keyword)

