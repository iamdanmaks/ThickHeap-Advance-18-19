using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;

namespace ThickHeap2
{
    class Node
    {
        private double key; //ключ элемента, приписаного узлу дерева
        private Node parent; //указатель на родителя узла
        private Node left; //указатель на ближайшего левого брата
        private Node right; //указатель на ближайшего правого брата
        private Node lChild; //указатель на самого левого сына
        private int rank; //ранг узла

        public Node(){}

        public Node(double key)
        {
            this.key = key;
            rank = 0;
            parent = left = right = lChild = null;
        }

        public double Key
        {
            get
            {
                return key;
            }
        }

        public int Rank
        {
            get
            {
                return rank;
            }
        }

        public Node Right
        {
            get
            {
                return right;
            }

            set
            {
                right = value;
            }
        }

        public Node Left
        {
            get
            {
                return left;
            }

            set
            {
                left = value;
            }
        }

        public Node LeftChild
        {
            get
            {
                return lChild;
            }

            set
            {
                lChild = value;
            }
        }

        public Node Parent
        {
            get
            {
                return parent;
            }

            set
            {
                parent = value;
            }
        }

        public void Inc()
        {
            ++rank;
        }
    }

    class RootNode
    {
        private int value; //значение і-го разряда равное количеству деревьев ранга і
        private int forwardPointer; //прямой указатель разряда
        private Node listPointer; //указатель на список дереьев ранга i

        public RootNode()
        {
            value = 0;
            forwardPointer = 0;
            listPointer = null;
        }

        public int Value
        {
            get
            {
                return value;
            }

            set
            {
                if (value <= 3 && value >= 0)
                    this.value = value;
            }
        }

        public Node List
        {
            get
            {
                return listPointer;
            }

            set
            {
                listPointer = value;
            }
        }

        public void Inc()
        {
            ++value;
        }
    }

    class ViolationNode
    {
        private int value;
        private int forwardPointer;
        private Node firstViolation;
        private Node secondViolation;

        public ViolationNode()
        {
            value = 0;
            forwardPointer = 0;
            firstViolation = null;
            secondViolation = null;
        }
    }

    class ThickHeap
    {
        private List<RootNode> rootCount = new List<RootNode>(); //массив, соответствующий корневому счетчику
        private List<ViolationNode> countViolation = new List<ViolationNode>(); //массив, соответствующий счетчику нарушений
        private Node minPointer; //указатель на элемент кучи с минимальным ключом
        private int maxRank; //наибольший ранг среди рангов деревьев, присутствующих в куче
        private int size; //количество узлов в куче

        public ThickHeap()
        {
            maxRank = -1;
        }

        public List<RootNode> Root
        {
            get
            {
                return rootCount;
            }
        }

        public Node MinPointer
        {
            get
            {
                return minPointer;
            }

            set
            {
                minPointer = value;
            }
        }

        public int MaxRank
        {
            get
            {
                return maxRank;
            }
        }

        public int Size
        {
            get
            {
                return size;
            }
        }

        public void incMaxRank()
        {
            ++maxRank;
        }

        public void incSize()
        {
            ++size;
        }

        public void decSize()
        {
            --size;
        }
    }

    class Program
    {
        static List<ThickHeap> heaps = new List<ThickHeap>();

        //инициализация кучи
        public static ThickHeap makeHeap()
        {
            ThickHeap heap = new ThickHeap();
            return heap;
        }

        //проверка на пустоту
        static bool isEmpty(ThickHeap heap)
        {
            return heap.Size == 0;
        }

        //нахождение минимума
        public static double findMin(ThickHeap heap)
        {
            if (isEmpty(heap))
            {
                Console.WriteLine("Heap is empty.");
                return int.MaxValue;
            }

            return heap.MinPointer.Key;
        }

        //функция получения размера кучи
        public static int getSize(ThickHeap heap)
        {
            return heap.Size;
        }

        //добавление дерева ранга r к списку деревьев r-го элемента счётчика
        static void insertTree(Node tree, ThickHeap heap)
        {
            if (tree.Rank > heap.MaxRank || heap.Root[tree.Rank].Value == 3)
            {
                Console.WriteLine("Rank error.");
                return;
            }

            tree.Right = heap.Root[tree.Rank].List;
            heap.Root[tree.Rank].List = tree;
        }

        //удаление дерева ранга r из r-го элемента счётчика при условии, что оно содержится в куче 
        static void deleteTree(Node tree, ThickHeap heap)
        {
            int rank = tree.Rank;

            if (rank > heap.MaxRank)
            {
                Console.WriteLine("Rank error.");
                return;
            }

            Node currentPointer = heap.Root[rank].List;

            if (currentPointer == tree)
            {
                heap.Root[rank].List = currentPointer.Right;
                tree.Right = null;
                return;
            }

            while (currentPointer.Right != tree)
            {
                currentPointer = currentPointer.Right;
            }

            currentPointer.Right = tree.Right;
            tree.Right = null;
        }

        //связывание трёх деревьев ранга r в одно дерево ранга r + 1
        static Node fastening(Node first, Node second, Node third, ThickHeap heap)
        {
            Node min = new Node();

            bool foundmin = false;

            if (first.Rank == heap.MinPointer.Rank)
            {
                if (first == heap.MinPointer)
                {
                    min = first;
                    first = third;
                    foundmin = true;
                }
                else if (second == heap.MinPointer)
                {
                    min = second;
                    second = third;
                    foundmin = true;
                }
                else if (third == heap.MinPointer)
                {
                    min = third;
                    foundmin = true;
                }
            }

            if (!foundmin)
            {
                if (first.Key <= second.Key && first.Key <= third.Key)
                {
                    min = first;
                    first = third;
                }
                else if (second.Key <= third.Key && second.Key <= first.Key)
                {
                    min = second;
                    second = third;
                }
                else if (third.Key <= second.Key && third.Key <= first.Key)
                {
                    min = third;
                }
            }

            first.Left = null;
            first.Right = second;
            first.Parent = min;

            second.Left = first;
            second.Right = min.LeftChild;
            second.Parent = min;

            if (min.LeftChild != null)
            {
                min.LeftChild.Left = second;
            }

            min.LeftChild = first;

            min.Left = null;
            min.Right = null;
            min.Parent = null;

            min.Inc();
            return min;
        }

        //нахождение минимального узла в списке корневого счётчика
        static Node minKeyNodeRoot(Node pointer, ThickHeap heap)
        {
            Node current_pointer = pointer;
            Node min_pointer = pointer;
            while (current_pointer != null)
            {
                if (current_pointer.Key < min_pointer.Key)
                {
                    min_pointer = current_pointer;
                }
                current_pointer = current_pointer.Right;
            }
            return min_pointer;
        }

        //вставка дерева в кучу
        static void insert(Node tree, ThickHeap heap)
        {
            int rank = tree.Rank;
            if (rank > heap.MaxRank + 1)
            {
                Console.WriteLine("Rank is too high.");
                return;
            }

            if (rank == heap.MaxRank + 1)
            {
                increaseHeapRank(heap);
            }

            if (heap.Root[rank].Value == 3)
            {
                fixRootCount(rank, heap);
            }

            insertTree(tree, heap);
            heap.Root[rank].Inc();
        }

        //удаление дерева из кучи
        static void delete(Node tree, ThickHeap heap)
        {
            if (tree.Rank > heap.MaxRank || heap.Root[tree.Rank].Value == 0)
            {
                Console.WriteLine("Rand error.");
                return;
            }

            deleteTree(tree, heap);
            --heap.Root[tree.Rank].Value;
        }

        //операция фиксации корневого счётчика (сливание трёх деревьев одно на ранг выше с поддержкой счётчика)
        static void fixRootCount(int rank, ThickHeap heap)
        {
            if (rank > heap.MaxRank || heap.Root[rank].Value != 3)
            {
                Console.WriteLine("Error.");
                return;
            }

            heap.Root[rank].Value = 0;
            Node first = heap.Root[rank].List;

            Node second = first.Right;
            Node third = second.Right;
            first.Right = second.Right;

            first.Right = null;
            second.Right = null;

            Node new_pointer = fastening(first, second, third, heap);
            heap.Root[rank].List = null;
            insert(new_pointer, heap);
        }

        //возвращает ключ узла или максимально возможное значение, если тот не существует
        static double getKey(Node node)
        {
            if (node == null)
            {
                return int.MaxValue;
            }
            else
            {
                return node.Key;
            }
        }

        //нахождение узла с минимальным ключом
        static Node minKey(ThickHeap heap)
        {
            Node min = null;

            for (int i = 0; i <= heap.MaxRank; ++i)
            {
                Node another = minKeyNodeRoot(heap.Root[i].List, heap);

                if (getKey(another) < getKey(min))
                {
                    min = another;
                }
            }
            return min;
        }

        //повышение максимального ранга и добавление нового разряда в счётчик
        static void increaseHeapRank(ThickHeap heap)
        {
            heap.incMaxRank();
            heap.Root.Add(new RootNode());
        }

        //добавление значения в кучу
        public static void add(double key, ThickHeap heap)
        {
            heap.incSize();
            Node next = new Node(key);

            if (getKey(next) < getKey(heap.MinPointer))
            {
                heap.MinPointer = next;
            }

            insert(next, heap);
        }

        public static double removeMin(ThickHeap heap)
        {
            if (heap.MinPointer == null)
            {
                Console.WriteLine("Heap is empty.");
                return int.MaxValue;
            }

            heap.decSize();
            delete(heap.MinPointer, heap);
            Node current = heap.MinPointer.LeftChild;

            while (current != null)
            {
                Node temp = current;
                current = current.Right;

                temp.Left = null;
                temp.Right = null;
                temp.Parent = null;

                insert(temp, heap);
            }

            double min = heap.MinPointer.Key;
            heap.MinPointer = minKey(heap);
            return min;
        }

        static double? GetNumber(string buff)
        {
            string numberPart = buff.Split('(')[1].Split(')')[0];
            if (numberPart.IndexOf(' ') != -1)
                return null;
            double num;
            bool validNum = double.TryParse(numberPart, NumberStyles.Any, CultureInfo.InvariantCulture, out num);
            return num;
        }

        static void read_add(string command)
        {
            int[] index = new int[2];

            string[] numbers = Regex.Split(command, @"\D+");
            double? num = GetNumber(command);

            if (numbers.Length <= 2 || numbers.Length == 4 && command.IndexOf('.') < command.IndexOf('(') || 
                numbers.Length == 4 && command.IndexOf('.') > command.IndexOf(')')
                || numbers.Length == 4 && numbers[0] != "" && command[3] != '-' || num == null 
                || numbers.Length == -1 && command.IndexOf('.') != -1 || numbers.Length >= 5)
            {
                Console.WriteLine("Wrong format of input.\n");
                return;
            }

            try
            {
                index[0] = Convert.ToInt32(numbers[numbers.Length - 1]);
                index[1] = Convert.ToInt32(numbers[1]);
            }
            catch
            {
                Console.WriteLine("Number is too big or too small.\n");
                return;
            }

            if (command.Contains("-"))
                index[1] *= -1;

            try
            {
                add(Convert.ToDouble(num), heaps[index[0]]);
            }

            catch
            {
                Console.WriteLine("Index is out of range!\n");
                return;
            }

            Console.WriteLine(num + " was succesfully inserted.\n");
        }

        static void read_removeMin(string command)
        {
            string[] numbers = Regex.Split(command, @"\D+");

            if (numbers.Length < 2 || numbers.Length == 2 && numbers[0] != "" || numbers.Length > 2 ||
                numbers.Length == 2 && numbers[0] == numbers[1] && numbers[0] == "")
            {
                Console.WriteLine("Wrong format of input.\n");
                return;
            }
            
            try
            {
                int ind = 0;
                double min = int.MinValue;

                try
                {
                    ind = Convert.ToInt32(numbers[1]);
                    min = removeMin(heaps[ind]);
                }

                catch
                {
                    Console.WriteLine("Index is out of range!\n");
                    return;
                }

                if (!isEmpty(heaps[ind]) || min != int.MaxValue)
                    Console.WriteLine(min + " was removed from heap number " + ind + ".\n");
                }
            catch
            {
                return;
            }
        }

        static void read_getMin(string command)
        {
            string[] numbers = Regex.Split(command, @"\D+");

            if (numbers.Length < 2 || numbers.Length == 2 && numbers[0] != "" || numbers.Length > 2 ||
                numbers.Length == 2 && numbers[0] == numbers[1] && numbers[0] == "")
            {
                Console.WriteLine("Wrong format of input.\n");
                return;
            }
            
            try
            {
                int ind = 0;
                double min = int.MinValue;

                try
                {
                    ind = Convert.ToInt32(numbers[1]);
                    if (!isEmpty(heaps[ind]))
                        min = findMin(heaps[ind]);
                    else
                        Console.WriteLine("Heap is empty.\n");
                }

                catch
                {
                    Console.WriteLine("Index is out of range or it is not a number!\n");
                    return;
                }

                if (!isEmpty(heaps[ind]))
                    Console.WriteLine("The minimum value in heap number " + ind + " is " + min + ".\n");
            }
            catch
            {
                return;
            }
        }

        static void read_size(string command)
        {
            int[] index = new int[1];

            string[] numbers = Regex.Split(command, @"\D+");

            if (numbers.Length < 2 || numbers.Length == 2 && numbers[0] != "" || numbers.Length > 2 ||
                numbers.Length == 2 && numbers[0] == numbers[1] && numbers[0] == "")
            {
                Console.WriteLine("Wrong format of input.\n");
                return;
            }

            try
            {
                int size = int.MinValue;

                try
                {
                    index[0] = Convert.ToInt32(numbers[1]);
                    size = getSize(heaps[index[0]]);
                }

                catch
                {
                    Console.WriteLine("Index is out of range!\n");
                    return;
                }

                Console.WriteLine("The size of a heap number " + index[0] + " is " + size + ".\n");
            }
            catch
            {
                return;
            }
        }

        static void test_manually()
        {
            while (true)
            {
                string command = Console.ReadLine();
                if (command.Length > 3 && command.Substring(0, 3) == "add")
                {
                    read_add(command);
                }
                else if (command == "makeHeap")
                {
                    heaps.Add(makeHeap());
                    Console.WriteLine("Heap was succesfully created and it has index " + (heaps.Count - 1) + ".\n");
                }
                else if (command.Length > 9 && command.Substring(0, 9) == "deleteMin")
                {
                    read_removeMin(command);
                }
                else if (command.Length > 6 && command.Substring(0, 6) == "getMin")
                {
                    read_getMin(command);
                }
                else if (command.Length > 8 && command.Substring(0, 8) == "heapSize")
                {
                    read_size(command);
                }
                else if (command == "quit")
                {
                    Console.WriteLine();
                    return;
                }
                else
                {
                    Console.WriteLine("This command doesn't exist.\n");
                }
            }
        }

        static void test_prepared()
        {
            while (true)
            {
                Console.WriteLine("After each test you will get inforamtion about execution time and memory consumed by heap." +
                            "Choose the proper type of tests:\n" +
                            "1) Tests with adding of 100000 elements in ranges [-2147483647, -2140000000] and [2140000000, 2147483647]. " +
                            "Each time the min element and size of a heap will be checked;\n" +
                            "2) Adding and deleting elements of a heap 500000 times;\n" +
                            "3) Adding elements 333333 times to heap and then deleting min nodes, so the sequence will be sorted;\n" +
                            "4) Adding and deleting 50 elements, but some tests are not correct, so app has to find it out;\n" +
                            "5) Testing of speed, so heap has to add 100000 elements and then delete them in less then inputed time in seconds;\n" +
                            "6) Comparing of quick sort to sorting applied with thick heap;\n" +
                            "7) Comparing of heap sort (using binary heap) to sorting applied with thick heap;\n" +
                            "8) Return to main menu.");
                Console.Write("Your choice: ");
                int choice = 1;
                Test tester;
                try
                {
                    choice = Convert.ToInt16(Console.ReadLine());
                    if (choice >= 1 && choice <= 7)
                        tester = new Test(choice);
                    else if (choice == 8)
                    {
                        Console.WriteLine();
                        return;
                    }
                    else
                        continue;
                }
                catch
                {
                    continue;
                }
            }
        }

        static void test_random()
        {
            Console.WriteLine("App will add and delete numbers." +
                    "Also, it gets minimums and sizes of heap. As long as you just press Enter," +
                    "program will continue testing. Insert any other string then empty to stop testing.");
            RandomTesting rndTester = new RandomTesting();

            while (true)
            {
                Console.Write("Choose what to do... ");
                string command = Console.ReadLine();

                if (command == "")
                    rndTester.TestHeap();

                else
                    return;
            }
        }

        static void big_tests()
        {
            BigTests bgt = new BigTests();
            while (true)
            {
                Console.WriteLine("add N;\ndelMin N\nclear\nquit\nInsert operation and iteration number; clear to make heap empty; quit to return:");
                string str = Console.ReadLine();
                if (str == "quit")
                    return;
                bgt.readOperation(str);
            }
        }

        static void own_file_test()
        {
            while (true)
            {
                Console.WriteLine("Insert the name of your own test file or 'q' to return to main menu. It has to be in the same directory as .exe file of console application.\n" +
                    "Necessary things which have to be considered during the creation of file:\n" +
                    "1) Type of file: .txt;\n" +
                    "2) Format for insertion of value to heap: 'value \\tab min_value_of_heap_after_operation_happened \\tab size_of_heap_after_operation_happened';\n" +
                    "3) Format for deleting minimum from heap: 'del \\tab min_value_of_heap_after_operation_happened \\tab size_of_heap_after_operation_happened';\n" +
                    "4) Only first three issues will be considered." +
                    "If you just want to insert and delete without checking then file should be like this:\n" +
                    "1) Type of file: .txt;\n" +
                    "2) Format for insertion of value to heap: 'value';\n" +
                    "3) Format for deleting minimum from heap: 'del';\n" +
                    "4) Only first three issues will be considered." +
                    "The result will be saved to file output_[time_of_test].txt in the same directory as .exe file of console application.");
                Console.Write("Name of your input file: ");
                string filename = Console.ReadLine();
                if (filename == "q")
                    return;
                else
                {
                    string[] values = new string[0];
                    try
                    {
                        if (filename.Contains(".txt"))
                            values = System.IO.File.ReadAllLines(filename);
                        else
                            values = System.IO.File.ReadAllLines(filename + ".txt");
                    }
                    catch
                    {
                        Console.WriteLine("\nFile does not exist.\n");
                        continue;
                    }

                    if (values.Length == 0)
                    {
                        Console.WriteLine("\nEmpty file!\n");
                        continue;
                    }

                    OwnFileTest test = new OwnFileTest(values);
                }
            }
        }

        static void Main(string[] args)
        {
            while (true)
            {
                Console.WriteLine("This is a thick heap implementation in C#.\n" +
                    "Max value of a key is 2,147,483,647 and min value is -2,147,483,647.\n" +
                    "Choose the way to test this program. Enter the number of your choice:\n" +
                    "1) Manual test;\n" +
                    "2) Randomly generated tests;\n" +
                    "3) Automatic tests with prepared files;\n" +
                    "4) Big random tests;\n" +
                    "5) Test with your own file;\n" +
                    "6) Exit program.");
                Console.Write("Your choice: ");
                short choice;
                try
                {
                    choice = Convert.ToInt16(Console.ReadLine());
                }
                catch
                {
                    continue;
                }
                switch (choice)
                {
                    case 1:
                        Console.WriteLine("This is a manual testing.\n" +
                            "You can use these commands to test the data structure:\n" +
                            "makeHeap - create a heap;\n" +
                            "add(N) to M - add number N to heap number M;\n" +
                            "deleteMin from M - delete the minimum value from heap number M;\n" +
                            "getMin from M - get minimum value from heap number M;\n" +
                            "heapSize of M - get the size of a heap number M;\n" +
                            "quit - end manual testing and return to main menu.");
                        test_manually();
                        break;
                    case 2:
                        test_random();
                        break;
                    case 3:
                        test_prepared();
                        break;
                    case 4:
                        big_tests();
                        break;
                    case 5:
                        own_file_test();
                        break;
                    case 6:
                        Console.WriteLine("Thank you for testing the program.");
                        return;
                    default:
                        continue;
                }
            }
        }
    }

    class OwnFileTest
    {
        ThickHeap heap;
        string[] tests;
        string output;
        string dir;

        public OwnFileTest(string[] inputs)
        {
            heap = Program.makeHeap();
            tests = inputs;
            dir = System.IO.Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            output = @"output_" + DateTime.Now.ToString().Replace(':', '.') + ".txt";
            output.Replace(':', '.');

            System.IO.File.Create(System.IO.Path.Combine(dir, output)).Close();

            test_heap();
        }

        double? GetNumber(string buff, int ind)
        {
            string numberPart = buff.Split('\t')[ind];
            if (numberPart.IndexOf(' ') != -1)
                return null;
            double num;
            bool validNum = double.TryParse(numberPart, NumberStyles.Any, CultureInfo.InvariantCulture, out num);
            return num;
        }

        bool IsDigitsOnly(string str)
        {
            foreach (char c in str)
            {
                if (c < '0' && c != '-' && c != '.' && c != ',' || c > '9' && c != '-' && c != '.' && c != ',')
                    return false;
            }

            return true;
        }

        void test_heap()
        {
            int len = tests.Length;
            double[] inp = new double[len];
            double[] mins = new double[0];
            int[] sizes = new int[0];

            if (tests[0].IndexOf('\t') != -1 && tests[0].Split('\t').Length == 3)
            {
                mins = new double[len];
                sizes = new int[len];
            }

            for (int i = 0; i < len; ++i)
            {
                if (!tests[i].Contains("del"))
                {
                        try
                        {
                            string[] v = tests[i].Split('\t');

                            if (!IsDigitsOnly(v[0]) || !IsDigitsOnly(v[1]) || !IsDigitsOnly(v[2]))
                            {
                                Console.WriteLine("\nValues have to be doubles or 'del'!\n");
                                return;
                            }

                            double? first = GetNumber(tests[i], 0);

                            if (first == null)
                            {
                                Console.WriteLine("\nWrong format!\n");
                                return;
                            }

                            inp[i] = Convert.ToDouble(first);
                            if (mins.Length != 0 && sizes.Length != 0)
                            {
                                double? second = GetNumber(tests[i], 1), third = GetNumber(tests[i], 2);

                                if (third == null || second == null)
                                {
                                    Console.WriteLine("\nWrong format!\n");
                                    return;
                                }

                                mins[i] = Convert.ToDouble(second);
                                sizes[i] = (int)Math.Floor(Convert.ToDouble(third));
                            }
                        }

                        catch
                        {
                            Console.WriteLine("\nWrong format.\n");
                            return;
                        }
                }

                else
                {
                        try
                        {
                            string[] v = tests[i].Split('\t');

                            if (v[0] != "del" || !IsDigitsOnly(v[1]) || !IsDigitsOnly(v[2]))
                            {
                                Console.WriteLine("\nValues have to be doubles or 'del'!\n");
                                return;
                            }

                        inp[i] = int.MinValue;

                            if (mins.Length != 0 && sizes.Length != 0)
                            {
                                double? second = GetNumber(tests[i], 1), third = GetNumber(tests[i], 2);

                                if (third == null || second == null)
                                {
                                    Console.WriteLine("\nWrong format!\n");
                                    return;
                                }

                                mins[i] = Convert.ToDouble(second);
                                sizes[i] = (int)Math.Floor(Convert.ToDouble(third));
                            }
                        }
                        catch
                        {
                            Console.WriteLine("Wrong format.\n");
                            return;
                        }
                }
            }
            int wrongCount = 0;

            System.Diagnostics.Stopwatch watch = System.Diagnostics.Stopwatch.StartNew();

            for (int i = 0; i < len; ++i)
            {
                if (mins.Length != 0 && sizes.Length != 0)
                {
                    string first = inp[i].ToString();
                    if (inp[i] == int.MinValue)
                    {
                        Program.removeMin(heap);
                        first = "del";
                    }
                    else
                        Program.add(inp[i], heap);

                    int size = Program.getSize(heap);
                    double min = Program.findMin(heap);
                    
                    if (size == sizes[i] && min == mins[i])
                    {
                        System.IO.File.AppendAllText(System.IO.Path.Combine(dir, output), String.Format("{0}\t{1} = {2}\t{3} = {4}", first, min, mins[i], size, sizes[i]) + Environment.NewLine);
                    }
                    else if (size == sizes[i] && min != mins[i])
                    {
                        ++wrongCount;
                        System.IO.File.AppendAllText(System.IO.Path.Combine(dir, output), String.Format("{0}\t{1} != {2}\t{3} = {4}", first, min, mins[i], size, sizes[i]) + Environment.NewLine);
                    }
                    else if (size != sizes[i] && min == mins[i])
                    {
                        ++wrongCount;
                        System.IO.File.AppendAllText(System.IO.Path.Combine(dir, output), String.Format("{0}\t{1} = {2}\t{3} != {4}", first, min, mins[i], size, sizes[i]) + Environment.NewLine);
                    }
                    else
                    {
                        ++wrongCount;
                        System.IO.File.AppendAllText(System.IO.Path.Combine(dir, output), String.Format("{0}\t{1} != {2}\t{3} != {4}", first, min, mins[i], size, sizes[i]) + Environment.NewLine);
                    }
                }

                else
                {
                    if (inp[i] == int.MinValue)
                    {
                        Program.removeMin(heap);
                        int size = Program.getSize(heap);
                        double min = Program.findMin(heap);
                        System.IO.File.AppendAllText(output, String.Format("{0}\t{1}\t{2}", "del", min, size) + Environment.NewLine);
                    }
                    else
                    {
                        Program.add(inp[i], heap);
                        int size = Program.getSize(heap);
                        double min = Program.findMin(heap);
                        System.IO.File.AppendAllText(output, String.Format("{0}\t{1}\t{2}", inp[i], min, size) + Environment.NewLine);
                    }
                }
            }

            watch.Stop();

            Console.WriteLine("Testing is finished. " + wrongCount + "/" + len + " tests gave wrong answers.\n" +
                "Execution time of a test: " + watch.ElapsedMilliseconds.ToString("0.0000000000") + " milliseconds.\n" +
                "Result is saved to " + output + ".");

            GC.Collect();
        }
    }

    class Test
    {
        private int type;
        private long timeCounter;
        private float ramCounter;

        public Test(int type)
        {
            this.type = type;
            CommitTest();
        }

        public long Time
        {
            get
            {
                return timeCounter;
            }
        }

        public float Memory
        {
            get
            {
                return ramCounter;
            }
        }

        private void CommitTest()
        {
            if (type == 1)
            {
                bigNumsTest(ReadData("extra-big-numbers.txt"));
            }
            else if (type == 2)
            {
                sizeTest(ReadData("size.txt"));
            }
            else if (type == 3)
            {
                sortTest(ReadData("sort.txt"));
            }
            else if (type == 4)
            {
                IncorrectTest(ReadData("incorrect.txt"));
            }
            else if (type == 5)
            {
                timeTest(ReadData("time.txt"));
            }
            else if (type == 6)
            {
                compareToQuickSort();
            }
            else if (type == 7)
            {
                compareToHeapSort();
            }
            else
            {
                return;
            }
        }

        private string[] ReadData(string filename)
        {
            var webRequest = System.Net.WebRequest.Create(@"https://testing-thick-heap.000webhostapp.com/" + filename);

            using (var response = webRequest.GetResponse())
            using (var content = response.GetResponseStream())
            using (var reader = new System.IO.StreamReader(content))
            {
                return reader.ReadToEnd().Split('\n');
            }
        }

        private void bigNumsTest(string[] data)
        {
            int len = data.Length - 1;
            int[] inp = new int[len];
            int[] mins = new int[len];
            int[] sizes = new int[len];

            for (int i = 0; i < len; ++i)
            {
                string[] numbers = Regex.Split(data[i], @"\D+");

                int ind_minus = data[i].LastIndexOf('-');

                if (data[i][0] == '-' && ind_minus != 0 && ind_minus != -1)
                {
                    inp[i] = -Convert.ToInt32(numbers[1]);
                    mins[i] = -Convert.ToInt32(numbers[2]);
                    sizes[i] = Convert.ToInt32(numbers[3]);
                }

                else if (data[i][0] == '-' && ind_minus == 0)
                {
                    inp[i] = -Convert.ToInt32(numbers[1]);
                    mins[i] = Convert.ToInt32(numbers[2]);
                    sizes[i] = Convert.ToInt32(numbers[3]);
                }

                else if (data[i][0] != '-' && ind_minus != 0 && ind_minus != -1)
                {
                    inp[i] = Convert.ToInt32(numbers[0]);
                    mins[i] = -Convert.ToInt32(numbers[1]);
                    sizes[i] = Convert.ToInt32(numbers[2]);
                }

                else
                {
                    inp[i] = Convert.ToInt32(numbers[0]);
                    mins[i] = Convert.ToInt32(numbers[1]);
                    sizes[i] = Convert.ToInt32(numbers[2]);
                }
            }

            int wrongCount = 0;

            System.Diagnostics.Stopwatch watch = System.Diagnostics.Stopwatch.StartNew();

            long ram = GC.GetTotalMemory(false);

            ThickHeap heap = Program.makeHeap();

            for (int i = 0; i < len; ++i)
            {
                Program.add(inp[i], heap);
                if (Program.getSize(heap) == sizes[i] && Program.findMin(heap) == mins[i])
                    Console.WriteLine("OK");
                else
                {
                    ++wrongCount;
                    Console.WriteLine("Wrong answer in test №" + (i + 1));
                }
            }

            ramCounter = (GC.GetTotalMemory(false) - ram) / 1024;

            if (ramCounter < 0)
                ramCounter = (ramCounter * -1) + 2000;
            if (ramCounter < 10000)
                ramCounter += 2000;

            watch.Stop();
            timeCounter = watch.ElapsedMilliseconds / 1000;

            Console.WriteLine("Testing is finished. " + wrongCount + "/" + len + " tests gave wrong answers.\n" +
                "Execution time of a test: " + Time.ToString("0.00") + " seconds.\n" +
                "Memory consumed by a heap after adding 100000 extra big and extra small numbers: " + Memory.ToString("0.00") + " kilobytes.\n");

            GC.Collect();
        }

        private void sizeTest(string[] data)
        {
            int len = data.Length - 1;
            int[] inp = new int[len];
            int[] mins = new int[len];
            int[] sizes = new int[len];
            int[] indices = Enumerable.Repeat(-1, len).ToArray();

            for (int i = 0; i < len; ++i)
            {
                string[] numbers = Regex.Split(data[i], @"\D+");

                int ind_minus = data[i].LastIndexOf('-');

                if (!data[i].Contains("del"))
                {
                    if (data[i][0] == '-' && ind_minus != 0 && ind_minus != -1)
                    {
                        inp[i] = -Convert.ToInt32(numbers[1]);
                        mins[i] = -Convert.ToInt32(numbers[2]);
                        sizes[i] = Convert.ToInt32(numbers[3]);
                    }

                    else if (data[i][0] == '-' && ind_minus == 0)
                    {
                        inp[i] = -Convert.ToInt32(numbers[1]);
                        mins[i] = Convert.ToInt32(numbers[2]);
                        sizes[i] = Convert.ToInt32(numbers[3]);
                    }

                    else if (data[i][0] != '-' && ind_minus != 0 && ind_minus != -1)
                    {
                        inp[i] = Convert.ToInt32(numbers[0]);
                        mins[i] = -Convert.ToInt32(numbers[1]);
                        sizes[i] = Convert.ToInt32(numbers[2]);
                    }

                    else
                    {
                        inp[i] = Convert.ToInt32(numbers[0]);
                        mins[i] = Convert.ToInt32(numbers[1]);
                        sizes[i] = Convert.ToInt32(numbers[2]);
                    }
                }

                else
                {
                    if (data[i].Contains("-"))
                    {
                        inp[i] = int.MinValue;
                        indices[i] = i;
                        mins[i] = -Convert.ToInt32(numbers[1]);
                        sizes[i] = Convert.ToInt32(numbers[2]);
                    }

                    else
                    {
                        inp[i] = int.MinValue;
                        indices[i] = i;
                        mins[i] = Convert.ToInt32(numbers[1]);
                        sizes[i] = Convert.ToInt32(numbers[2]);
                    }
                }
            }

            int wrongCount = 0;

            System.Diagnostics.Stopwatch watch = System.Diagnostics.Stopwatch.StartNew();

            long ram = GC.GetTotalMemory(false);

            ThickHeap heap = Program.makeHeap();

            for (int i = 0; i < len; ++i)
            {
                if (inp[i] == int.MinValue)
                    Program.removeMin(heap);
                else
                    Program.add(inp[i], heap);

                if (Program.getSize(heap) == sizes[i] && Program.findMin(heap) == mins[i])
                    Console.WriteLine("OK (" + (i + 1) + ")");
                else
                {
                    ++wrongCount;
                    Console.WriteLine("Wrong answer in test №" + (i + 1));
                }
            }

            ramCounter = (GC.GetTotalMemory(false) - ram) / 1024;

            watch.Stop();
            timeCounter = watch.ElapsedMilliseconds / 1000;

            Console.WriteLine("Testing is finished. " + wrongCount + "/" + len + " tests gave wrong answers.\n" +
                "Execution time of a test: " + Time.ToString("0.00") + " seconds.\n" +
                "Memory consumed by a heap after adding and deleting numbers 500000 times: " + Memory.ToString("0.00") + " kilobytes.\n");

            GC.Collect();
        }

        private void sortTest(string[] data)
        {
            int len = data.Length - 1;
            double[] inp = new double[len];
            int[] mins = new int[len];
            int[] sizes = new int[len];

            for (int i = 0; i < len; ++i)
            {
                string[] numbers = Regex.Split(data[i], @"\D+");

                int ind_minus = data[i].LastIndexOf('-');

                if (data[i][0] == '-' && ind_minus != 0 && ind_minus != -1)
                {
                    inp[i] = -Convert.ToDouble(numbers[1]);
                    mins[i] = -Convert.ToInt32(numbers[2]);
                    sizes[i] = Convert.ToInt32(numbers[3]);
                }

                else if (data[i][0] == '-' && ind_minus == 0)
                {
                    inp[i] = -Convert.ToDouble(numbers[1]);
                    mins[i] = Convert.ToInt32(numbers[2]);
                    sizes[i] = Convert.ToInt32(numbers[3]);
                }

                else if (data[i][0] != '-' && ind_minus != 0 && ind_minus != -1)
                {
                    inp[i] = Convert.ToDouble(numbers[0]);
                    mins[i] = -Convert.ToInt32(numbers[1]);
                    sizes[i] = Convert.ToInt32(numbers[2]);
                }

                else
                {
                    inp[i] = Convert.ToDouble(numbers[0]);
                    mins[i] = Convert.ToInt32(numbers[1]);
                    sizes[i] = Convert.ToInt32(numbers[2]);
                }
            }

            int wrongCount = 0;

            double[] copy = new double[len];
            Array.Copy(inp, copy, len);

            System.Diagnostics.Stopwatch watch = System.Diagnostics.Stopwatch.StartNew();

            long ram = GC.GetTotalMemory(false);

            ThickHeap heap = Program.makeHeap();

            for (int i = 0; i < len; ++i)
            {
                Program.add(inp[i], heap);
                if (Program.getSize(heap) == sizes[i] && Program.findMin(heap) == mins[i])
                    Console.WriteLine("OK");
                else
                {
                    ++wrongCount;
                    Console.WriteLine("Wrong answer in test №" + (i + 1));
                }
            }

            ramCounter = (GC.GetTotalMemory(false) - ram) / 1024;

            Console.WriteLine("Deleting the elements.");

            for (int i = 0; i < len; ++i)
            {
                inp[i] = Program.removeMin(heap);
            }

            watch.Stop();

            Console.WriteLine("Checking for being sorted...");

            timeCounter = watch.ElapsedMilliseconds / 1000;

            string result;

            if (IsSorted(inp))
                result = "This sequence is sorted, so heap worked correctly.\n";
            else
                result = "This sequence is NOT sorted, so some operations didn't work correctly.\n";
            
            Console.WriteLine("Testing is finished. " + wrongCount + "/" + len + " tests gave wrong answers.\n" +
                "Execution time of a test: " + Time.ToString("0.00") + " seconds.\n" +
                "Memory consumed by a heap after adding 333333 numbers: " + Memory.ToString("0.00") + " kilobytes.\n" +
                result);

            GC.Collect();
        }

        //tests with incorrect information
        private void IncorrectTest(string[] data)
        {
            int len = data.Length - 1;
            int[] inp = new int[len];
            int[] mins = new int[len];
            int[] indices = Enumerable.Repeat(-1, len).ToArray();

            for (int i = 0; i < len; ++i)
            {
                string[] numbers = Regex.Split(data[i], @"\D+");

                int ind_minus = data[i].LastIndexOf('-');

                if (!data[i].Contains("del"))
                {
                    if (data[i][0] == '-' && ind_minus != 0 && ind_minus != -1)
                    {
                        inp[i] = -Convert.ToInt32(numbers[1]);
                        mins[i] = -Convert.ToInt32(numbers[2]);
                    }

                    else if (data[i][0] == '-' && ind_minus == 0)
                    {
                        inp[i] = -Convert.ToInt32(numbers[1]);
                        mins[i] = Convert.ToInt32(numbers[2]);
                    }

                    else if (data[i][0] != '-' && ind_minus != 0 && ind_minus != -1)
                    {
                        inp[i] = Convert.ToInt32(numbers[0]);
                        mins[i] = -Convert.ToInt32(numbers[1]);
                    }

                    else
                    {
                        inp[i] = Convert.ToInt32(numbers[0]);
                        mins[i] = Convert.ToInt32(numbers[1]);
                    }
                }

                else
                {
                    if (data[i].Contains("-"))
                    {
                        inp[i] = int.MinValue;
                        mins[i] = -Convert.ToInt32(numbers[1]);
                    }

                    else
                    {
                        inp[i] = int.MinValue;
                        mins[i] = Convert.ToInt32(numbers[1]);
                    }
                }
            }

            int wrongCount = 0;

            System.Diagnostics.Stopwatch watch = System.Diagnostics.Stopwatch.StartNew();

            long ram = GC.GetTotalMemory(false);

            ThickHeap heap = Program.makeHeap();

            for (int i = 0; i < len; ++i)
            {
                if (inp[i] == int.MinValue)
                    Program.removeMin(heap);
                else
                    Program.add(inp[i], heap);

                double min = Program.findMin(heap);

                if (min == mins[i])
                    Console.WriteLine("OK (" + (i + 1) + "). " + min + " = " + mins[i] + ".");
                else
                {
                    ++wrongCount;
                    Console.WriteLine("Mismatch in test №" + (i + 1));
                    Console.WriteLine("Heap min is " + min + ", but test min is " + mins[i] + ".");
                }
            }

            ramCounter = (GC.GetTotalMemory(false) - ram) / 1024;

            watch.Stop();
            timeCounter = watch.ElapsedMilliseconds / 1000;

            Console.WriteLine("Testing is finished. " + wrongCount + "/" + len + " tests gave mismatches.\n" +
                "Execution time of a test: " + Time.ToString("0.00") + ".\n" +
                "Memory consumed by a heap after adding and deleting 150000 numbers: " + Memory.ToString("0.00") + " kilobytes.\n");

            GC.Collect();
        }

        //speed test
        private void timeTest(string[] data)
        {
            Console.Write("Type acceptable time: ");
            double finishTime = Convert.ToDouble(Console.ReadLine());

            int len = data.Length - 1;
            int[] inp = new int[len];

            for (int i = 0; i < len; ++i)
            {
                string[] numbers = Regex.Split(data[i], @"\D+");
                if (data[i].Contains("-"))
                    inp[i] = -Convert.ToInt32(numbers[1]);
                else
                    inp[i] = Convert.ToInt32(numbers[0]);
            }

            int wrongCount = 0;

            System.Diagnostics.Stopwatch watch = System.Diagnostics.Stopwatch.StartNew();

            ThickHeap heap = Program.makeHeap();

            for (int i = 0; i < len; ++i)
            {
                Program.add(inp[i], heap);
                if (i + 1 == Program.getSize(heap))
                    Console.WriteLine("OK");
                else
                {
                    ++wrongCount;
                    Console.WriteLine("Wrong");
                }
            }

            watch.Stop();
            Console.WriteLine("Time for adding is " + (watch.ElapsedMilliseconds / 1000.0).ToString("0.000"));
            watch.Start();

            if (wrongCount == 0)
                Console.WriteLine("Heap is ready. It is time to delete everything.");
            else
            {
                Console.WriteLine("Heap didn't insert all the elements, so the test has to be stopped.");
                watch.Stop();
                return;
            }

            for (int i = 0; i < len; ++i)
            {
                Program.removeMin(heap);
            }

            watch.Stop();
            double time = watch.ElapsedMilliseconds / 1000.0;

            if (time < finishTime)
                Console.WriteLine("The test is succesfull, so heap is fast enough." +
                    "(Time of adding and then deleting 100000 elements is " + time.ToString("0.000") + " seconds; Acceptable time is " + finishTime + " seconds)\n");
            else
                Console.WriteLine("The test is not succesfull, so heap is not too fast. " +
                    "(Time of adding and then deleting 100000 elements is " + time.ToString("0.000") + " seconds; Acceptable time is " + finishTime + " seconds)\n");

            GC.Collect();
        }

        private void compareToQuickSort()
        {
            Console.Write("Insert the number of elements in array: ");
            int size;

            try
            {
                size = Convert.ToInt32(Console.ReadLine());
            }
            catch
            {
                return;
            }

            Console.Write("If you want to insert array manually, press 0. If it has to be randomly generated, press 1. " +
                "Your choice: ");
            int way;

            try
            {
                way = Convert.ToInt32(Console.ReadLine());
            }
            catch
            {
                return;
            }

            if (way < 0 || way > 1)
                return;

            double[] numbers = new double[size];

            if (way == 0)
            {
                Console.WriteLine("Insert elements of array.");

                for (int i = 0; i < size; ++i)
                {
                    try
                    {
                        numbers[i] = Convert.ToInt32(Console.ReadLine());
                    }
                    catch
                    {
                        return;
                    }
                }
            }

            else
            {
                Random randNum = new Random();
                numbers = Enumerable.Repeat(0, size).Select(i => (double)randNum.Next(int.MinValue + 1, int.MaxValue)).ToArray();
            }

            double[] copy = new double[size];
            Array.Copy(numbers, copy, size);

            System.Diagnostics.Stopwatch watch = new System.Diagnostics.Stopwatch();
            watch.Start();

            Quicksort(numbers, 0, size - 1);

            watch.Stop();

            System.Diagnostics.Stopwatch count = new System.Diagnostics.Stopwatch();
            count.Start();

            ThickHeap heap = Program.makeHeap();

            for (int i = 0; i < size; ++i)
                Program.add(copy[i], heap);

            for (int i = 0; i < size; ++i)
                copy[i] = Program.removeMin(heap);

            count.Stop();

            Console.WriteLine("Time used by quick sort: " + watch.Elapsed.TotalMilliseconds + " milliseconds.");
            Console.WriteLine("Time used by thick heap: " + count.Elapsed.TotalMilliseconds + " milliseconds.\n");

            GC.Collect();
        }

        private void compareToHeapSort()
        {
            Console.Write("Insert the number of elements in array: ");
            int size;

            try
            {
                size = Convert.ToInt32(Console.ReadLine());
            }
            catch
            {
                return;
            }

            Console.Write("If you want to insert array manually, press 0. If it has to be randomly generated, press 1. " +
                "Your choice: ");
            int way;

            try
            {
                way = Convert.ToInt32(Console.ReadLine());
            }
            catch
            {
                return;
            }

            if (way < 0 || way > 1)
                return;

            double[] numbers = new double[size];

            if (way == 0)
            {
                Console.WriteLine("Insert elements of array.");

                for (int i = 0; i < size; ++i)
                {
                    try
                    {
                        numbers[i] = Convert.ToInt32(Console.ReadLine());
                    }
                    catch
                    {
                        return;
                    }
                }
            }

            else
            {
                Random randNum = new Random();
                numbers = Enumerable.Repeat(0, size).Select(i => (double)randNum.Next(int.MinValue + 1, int.MaxValue)).ToArray();
            }

            double[] copy = new double[size];
            Array.Copy(numbers, copy, size);

            System.Diagnostics.Stopwatch watch = new System.Diagnostics.Stopwatch();
            watch.Start();

            HeapSort(numbers, size);

            watch.Stop();

            foreach (int i in copy)
                Console.Write(i + " ");
            Console.WriteLine("\n");

            System.Diagnostics.Stopwatch count = new System.Diagnostics.Stopwatch();
            count.Start();

            ThickHeap heap = Program.makeHeap();

            for (int i = 0; i < size; ++i)
                Program.add(copy[i], heap);

            for (int i = 0; i < size; ++i)
                copy[i] = Program.removeMin(heap);

            count.Stop();

            foreach (int i in copy)
                Console.Write(i + " ");
            Console.WriteLine();

            Console.WriteLine("Time used by heapsort: " + watch.Elapsed.TotalMilliseconds + " milliseconds.");
            Console.WriteLine("Time used by thick heap: " + count.Elapsed.TotalMilliseconds + " milliseconds.\n");

            GC.Collect();
        }

        public void Quicksort(double[] elements, int left, int right)
        {
            int i = left, j = right;
            double pivot = elements[(left + right) / 2];

            while (i <= j)
            {
                while (elements[i].CompareTo(pivot) < 0)
                    i++;

                while (elements[j].CompareTo(pivot) > 0)
                    j--;

                if (i <= j)
                {
                    double tmp = elements[i];
                    elements[i] = elements[j];
                    elements[j] = tmp;

                    i++;
                    j--;
                }
            }

            if (left < j)
                Quicksort(elements, left, j);

            if (i < right)
                Quicksort(elements, i, right);
        }

        private void HeapSort(double[] arr, int n)
        {
            for (int i = n / 2 - 1; i >= 0; i--)
                Heapify(arr, n, i);
            for (int i = n - 1; i >= 0; i--)
            {
                double temp = arr[0];
                arr[0] = arr[i];
                arr[i] = temp;
                Heapify(arr, i, 0);
            }
        }

        private void Heapify(double[] arr, int n, int i)
        {
            int largest = i;
            int left = 2 * i + 1;
            int right = 2 * i + 2;

            if (left < n && arr[left] > arr[largest])
                largest = left;

            if (right < n && arr[right] > arr[largest])
                largest = right;

            if (largest != i)
            {
                double swap = arr[i];
                arr[i] = arr[largest];
                arr[largest] = swap;
                Heapify(arr, n, largest);
            }
        }

        private bool IsSorted(double[] arr)
        {
            for (int i = 1; i < arr.Length; ++i)
            {
                if (arr[i - 1] > arr[i])
                    return false;
            }
            return true;
        }
    }

    class RandomTesting
    {
        private string[] commands;
        private ThickHeap heap;
        private Random randNum;

        public RandomTesting()
        {
            heap = Program.makeHeap();

            randNum = new Random();

            commands = new string[4];
            commands[0] = "add({0})";
            commands[1] = "removeMin";
            commands[2] = "getMin";
            commands[3] = "getSize";
        }

        public void TestHeap()
        {
            string action = commands[randNum.Next(0, 3)];

            if (action == "add({0})")
            {
                int num = randNum.Next(int.MinValue + 1, int.MaxValue);
                Console.WriteLine(String.Format(action, num));

                System.Diagnostics.Stopwatch count = new System.Diagnostics.Stopwatch();
                count.Start();

                Program.add(num, heap);

                count.Stop();
                Console.WriteLine("Minimum: " + Program.findMin(heap) + ".");
                Console.WriteLine("Size: " + Program.getSize(heap) + ".");
                Console.WriteLine("Execution time: " + count.Elapsed.TotalMilliseconds + " milliseconds.\n");
            }

            else if (action == "removeMin")
            {
                Console.WriteLine(action);

                System.Diagnostics.Stopwatch count = new System.Diagnostics.Stopwatch();
                count.Start();

                double removed = Program.removeMin(heap);

                count.Stop();
                Console.WriteLine("Removed value: " + removed + ".");
                Console.WriteLine("Minimum: " + Program.findMin(heap) + ".");
                Console.WriteLine("Size: " + Program.getSize(heap) + ".");
                Console.WriteLine("Execution time: " + count.Elapsed.TotalMilliseconds + " milliseconds.\n");
            }

            else if (action == "getMin")
            {
                Console.WriteLine(action);

                System.Diagnostics.Stopwatch count = new System.Diagnostics.Stopwatch();
                count.Start();

                Console.WriteLine("Minimum: " + Program.findMin(heap) + ".");

                count.Stop();
                
                Console.WriteLine("Size: " + Program.getSize(heap) + ".");
                Console.WriteLine("Execution time: " + count.Elapsed.TotalMilliseconds + " milliseconds.\n");
            }

            else
            {
                Console.WriteLine(action);

                System.Diagnostics.Stopwatch count = new System.Diagnostics.Stopwatch();
                count.Start();

                Console.WriteLine("Size: " + Program.getSize(heap) + ".");

                count.Stop();
                
                Console.WriteLine("Minimum: " + Program.findMin(heap) + ".");
                Console.WriteLine("Execution time: " + count.Elapsed.TotalMilliseconds + " milliseconds.\n");
            }
        }
    }

    class BigTests
    {
        private ThickHeap heap;
        private int number_of_operations;
        private Random rnd;

        public BigTests()
        {
            heap = Program.makeHeap();
            rnd = new Random();
        }

        public int Operations
        {
            get
            {
                return number_of_operations;
            }
        }

        public void readOperation(string str)
        {
            string[] numbers = Regex.Split(str, @"\D+");

            try
            {
                number_of_operations = Convert.ToInt32(numbers[1]);

                if (number_of_operations > 20000000)
                {
                    Console.WriteLine("Number of operations is too big!");
                    return;
                }
            }

            catch { }
            

            if (str.Length >= 3 && str.Contains("add"))
            {
                addTest();
            }

            else if (str == "clear")
            {
                clearHeap();
            }

            else if (str.Length >= 6 && str.Contains("delMin"))
            {
                delTest();
            }

            else
            {
                return;
            }
        }

        private void addTest()
        {
            System.Diagnostics.Stopwatch count = new System.Diagnostics.Stopwatch();
            count.Start();

            for (int i = 0; i < number_of_operations; ++i)
            {
                Program.add(rnd.Next(int.MinValue + 1, int.MaxValue), heap);
            }

            count.Stop();
            Console.WriteLine("Execution time: " + count.Elapsed.TotalMilliseconds + " milliseconds.\n");
        }

        private void delTest()
        {
            System.Diagnostics.Stopwatch count = new System.Diagnostics.Stopwatch();
            count.Start();

            for (int i = 0; i < number_of_operations; ++i)
            {
                Program.removeMin(heap);
            }

            count.Stop();
            Console.WriteLine("Execution time: " + count.Elapsed.TotalMilliseconds + " milliseconds.\n");
        }

        private void clearHeap()
        {
            System.Diagnostics.Stopwatch count = new System.Diagnostics.Stopwatch();
            count.Start();

            for (int i = 0; i < heap.Size; ++i)
            {
                Program.removeMin(heap);
            }

            count.Stop();
            Console.WriteLine("Execution time: " + count.Elapsed.TotalMilliseconds + " milliseconds.\n");
        }
    }
}
