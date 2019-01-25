from random import randint
from random import sample
from statistics import mean


def extra_big_nums_test():
    numbers = []
    
    #writing to files
    test_file = open("extra-big-numbers.txt", "a+")

    #generate numbers in ranges: [-2147483647, -2140000000], [2140000000, 2147483647]
    for i in range(50000):
        numbers.append(randint(2140000000, 2147483647))
        test_file.write(str(numbers[-1]) + "\t" + str(min(numbers)) + "\t" + str(len(numbers)) + "\n")
        
        numbers.append(randint(-2147483647, -2140000000))
        test_file.write(str(numbers[-1]) + "\t" + str(min(numbers)) + "\t" + str(len(numbers)) + "\n")
        print(i)

    test_file.close()


def size_test():
    numbers = []
    indices = sample(range(0, 499999), 175555)
    ind = 0

    #writing to files
    test_file = open("size.txt", "a+")

    #generate 500000 numbers
    for i in range(500000):
        if i in indices:
            try:
                numbers.remove(min(numbers))
            except:
                pass
            try:
                test_file.write("del\t" + str(min(numbers)) + "\t" + str(len(numbers)) + "\n")
            except:
                test_file.write("del\t" + str(2147483647) + "\t" + str(len(numbers)) + "\n")
            ind += 1
            print("delete", i)
        else:
            numbers.append(randint(-2147483647, 2147483647))
            test_file.write(str(numbers[-1]) + "\t" + str(min(numbers)) + "\t" + str(len(numbers)) + "\n")
            print(i)

    test_file.close()


def sort_test():
    numbers = []
    
    #writing to files
    test_file = open("sort.txt", "a+")

    #generate numbers
    for i in range(333333):
        numbers.append(randint(-2147483647, 2147483647))
        test_file.write(str(numbers[-1]) + "\t" + str(min(numbers)) + "\t" + str(len(numbers)) + "\n")
        print(i)

    test_file.close()


def incorrect_test():
    numbers = []
    
    #writing to files
    test_file = open("incorrect.txt", "a+")

    #generate numbers
    for i in range(50):
        if i % 11 == 0:
            numbers.append(randint(-2147483647, 2147483647))
            test_file.write(str(numbers[-1]) + "\t" + str(max(numbers)) + "\n")
        elif i % 15 == 0:
            numbers.remove(min(numbers))
            test_file.write("del\t" + str(max(numbers)) + "\n")
        elif i % 16 == 0:
            numbers.remove(min(numbers))
            test_file.write("del\t" + str(min(numbers)) + "\n")
        elif i % 17 == 0:
            numbers.append(randint(-2147483647, 2147483647))
            test_file.write(str(numbers[-1]) + "\t" + str(int(mean(numbers))) + "\n")
        elif i % 4 == 0:
            numbers.remove(min(numbers))
            test_file.write("del\t" + str(min(numbers)) + "\n")
        else:
            numbers.append(randint(-2147483647, 2147483647))
            test_file.write(str(numbers[-1]) + "\t" + str(min(numbers)) + "\n")

        print(i)

    test_file.close()


def time_test():
    #writing to files
    test_file = open("time.txt", "a+")

    #generate numbers
    for i in range(100000):
        test_file.write(str(randint(-2147483647, 2147483647)) + "\n")
        print(i)

    test_file.close()


incorrect_test()
