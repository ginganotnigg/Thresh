const tags = [
	{ name: 'Programming' },
	{ name: 'Algorithms' },
	{ name: 'Databases' },
	{ name: 'Networking' },
	{ name: 'Cybersecurity' },
	{ name: 'Web Development' },
	{ name: 'Cloud Computing' },
	{ name: 'UI/UX Design' },
	{ name: 'Machine Learning' },
	{ name: 'Distributed Systems' },
	{ name: 'Operating Systems' },
];

const tests = [
	{
		companyId: '1',
		title: 'Software Design Patterns Test',
		description: 'Understanding of software design patterns for best coding practices',
		minutesToAnswer: 20,
		difficulty: 'easy',
	},
	{
		companyId: '1',
		title: 'Data Structures Test',
		description: 'Conceptual understanding of various data structures and algorithms',
		minutesToAnswer: 10,
		difficulty: 'easy',
	},
	{
		companyId: '2',
		title: 'Networking Test',
		description: 'Knowledge about various network protocols and devices',
		minutesToAnswer: 15,
		difficulty: 'easy',
	},
	{
		companyId: '2',
		title: 'Distributed Systems Test',
		description: 'Understanding of distributed systems and their components',
		minutesToAnswer: 25,
		difficulty: 'hard',
	},
	{
		companyId: '1',
		title: 'Computer Organization Test',
		description: 'Knowledge about computer architecture and operations',
		minutesToAnswer: 15,
		difficulty: 'medium',
	},
	{
		companyId: '1',
		title: 'Operating Systems Test',
		description: 'Conceptual understanding of operating systems and their functions',
		minutesToAnswer: 20,
		difficulty: 'hard',
	},
	{
		companyId: '2',
		title: 'Database Systems Test',
		description: 'Understanding of database systems and SQL language',
		minutesToAnswer: 10,
		difficulty: 'easy',
	},
	{
		companyId: '3',
		title: 'UI/UX Design Test',
		description: 'Awareness of UI/UX designing principles',
		minutesToAnswer: 15,
		difficulty: 'medium',
	},
	{
		companyId: '2',
		title: 'Machine Learning Test',
		description: 'Knowledge about machine learning algorithms and their applications',
		minutesToAnswer: 30,
		difficulty: 'hard',
	},
	{
		companyId: '1',
		title: 'Web Development Test',
		description: 'Understanding of web development concepts and languages',
		minutesToAnswer: 20,
		difficulty: 'medium',
	},
	{
		companyId: '1',
		title: 'Hardware Design Test',
		description: 'Knowledge about hardware designing and related concepts',
		minutesToAnswer: 10,
		difficulty: 'easy',
	},
	{
		companyId: '1',
		title: 'Enterprise Software Test',
		description: 'Understanding of enterprise software and related concepts',
		minutesToAnswer: 20,
		difficulty: 'hard',
	},
];

const testsTags = [
	{ testId: 1, tagId: 1 },
	{ testId: 1, tagId: 2 },
	{ testId: 2, tagId: 1 },
	{ testId: 2, tagId: 2 },
	{ testId: 2, tagId: 3 },
	{ testId: 3, tagId: 4 },
	{ testId: 3, tagId: 5 },
	{ testId: 4, tagId: 2 },
	{ testId: 4, tagId: 7 },
	{ testId: 4, tagId: 10 },
	{ testId: 5, tagId: 1 },
	{ testId: 5, tagId: 3 },
	{ testId: 5, tagId: 11 },
	{ testId: 6, tagId: 1 },
	{ testId: 6, tagId: 5 },
	{ testId: 6, tagId: 11 },
	{ testId: 7, tagId: 1 },
	{ testId: 7, tagId: 3 },
	{ testId: 8, tagId: 6 },
	{ testId: 8, tagId: 8 },
	{ testId: 9, tagId: 1 },
	{ testId: 9, tagId: 9 },
	{ testId: 10, tagId: 1 },
	{ testId: 10, tagId: 6 },
	{ testId: 11, tagId: 3 },
	{ testId: 11, tagId: 5 },
	{ testId: 11, tagId: 11 },
	{ testId: 12, tagId: 1 },
	{ testId: 12, tagId: 3 },
	{ testId: 12, tagId: 7 },
];

const questions_Temp1 = [
	// Questions for Test 1
	[
		{
			text: 'What is a design pattern?',
			options: ['A reusable solution to a common problem', 'A specific piece of code', 'A programming language', 'A type of software'],
			points: 5,
		},
		{
			text: 'Which of the following is a creational design pattern?',
			options: ['Singleton', 'Observer', 'Decorator', 'Strategy'],
			points: 10,
		},
		{
			text: 'What is the main purpose of the Factory Method pattern?',
			options: ['To create objects without specifying the exact class', 'To define a family of algorithms', 'To provide a unified interface for a set of interfaces', 'To add new functionality to an existing class'],
			points: 10,
		},
		{
			text: 'Which design pattern is used to provide a simplified interface to a complex subsystem?',
			options: ['Facade', 'Adapter', 'Bridge', 'Composite'],
			points: 10,
		},
		{
			text: 'What does the Observer pattern do?',
			options: ['Creates a one-to-many dependency between objects', 'Allows an object to notify other objects about changes', 'Encapsulates a request as an object', 'Provides a way to access the elements of an aggregate object sequentially'],
			points: 15,
		},
		{
			text: 'Which of the following is NOT a structural design pattern?',
			options: ['Singleton', 'Decorator', 'Proxy', 'Composite'],
			points: 10,
		},
		{
			text: 'What is the main benefit of using design patterns?',
			options: ['Improved code readability and maintainability', 'Faster execution time', 'Reduced memory usage', 'Easier debugging'],
			points: 10,
		},
		{
			text: 'In which scenario would you use the Strategy pattern?',
			options: ['When you want to define a family of algorithms', 'When you want to create a single instance of a class', 'When you want to add new functionality to an existing class', 'When you want to provide a unified interface for a set of interfaces'],
			points: 10,
		},
		{
			text: 'What is the main purpose of the Command pattern?',
			options: ['To encapsulate a request as an object', 'To create a one-to-many dependency between objects', 'To provide a simplified interface to a complex subsystem', 'To define a family of algorithms'],
			points: 10,
		},
		{
			text: 'Which design pattern allows you to add new functionality to an existing class without modifying its structure?',
			options: ['Decorator', 'Adapter', 'Facade', 'Observer'],
			points: 10,
		},
	],
	// Questions for Test 2
	[
		{
			text: 'What is the time complexity of accessing an element in an array?',
			options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
			points: 5,
		},
		{
			text: 'Which of the following data structures uses LIFO (Last In First Out) order?',
			options: ['Stack', 'Queue', 'Array', 'Linked List'],
			points: 10,
		},
		{
			text: 'What is the primary advantage of using a linked list over an array?',
			options: ['Dynamic size', 'Faster access time', 'Better memory locality', 'Easier to implement'],
			points: 10,
		},
		{
			text: 'Which of the following is a characteristic of a binary search tree?',
			options: ['Each node has at most two children', 'All nodes have the same value', 'It is always balanced', 'It can have more than two children'],
			points: 10,
		},
		{
			text: 'What is the worst-case time complexity for searching an element in a balanced binary search tree?',
			options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(1)'],
			points: 10,
		},
		{
			text: 'Which data structure is used to implement a breadth-first search (BFS)?',
			options: ['Queue', 'Stack', 'Array', 'Linked List'],
			points: 15,
		},
		{
			text: 'What is the space complexity of a recursive function that uses a stack?',
			options: ['O(n)', 'O(1)', 'O(log n)', 'O(n^2)'],
			points: 10,
		},
		{
			text: 'Which of the following sorting algorithms has the best average-case time complexity?',
			options: ['Quick Sort', 'Bubble Sort', 'Insertion Sort', 'Selection Sort'],
			points: 15,
		},
		{
			text: 'What is the primary disadvantage of using a hash table?',
			options: ['Collision handling', 'Memory usage', 'Speed of access', 'Ease of implementation'],
			points: 10,
		},
		{
			text: 'In a graph, what does it mean if two vertices are connected by an edge?',
			options: ['There is a direct relationship between them', 'They are part of the same component', 'They have the same value', 'They are both leaf nodes'],
			points: 5,
		},
	],
	// Questions for Test 3
	[
		{
			text: 'What does IP stand for in networking?',
			options: ['Internet Protocol', 'Internal Protocol', 'Internet Package', 'Internal Package'],
			points: 10,
		},
		{
			text: 'Which layer of the OSI model is responsible for routing?',
			options: ['Network Layer', 'Transport Layer', 'Data Link Layer', 'Application Layer'],
			points: 15,
		},
		{
			text: 'What is the primary purpose of a router?',
			options: ['To forward data packets between networks', 'To connect devices within a local network', 'To filter incoming traffic', 'To provide wireless connectivity'],
			points: 10,
		},
		{
			text: 'Which protocol is used to send email?',
			options: ['SMTP', 'HTTP', 'FTP', 'POP3'],
			points: 15,
		},
		{
			text: 'What is the maximum length of a CAT5 Ethernet cable?',
			options: ['100 meters', '200 meters', '300 meters', '400 meters'],
			points: 5,
		},
		{
			text: 'Which of the following is a private IP address?',
			options: ['192.168.1.1', '172.16.0.1', '10.0.0.1', 'All of the above'],
			points: 10,
		},
		{
			text: 'What does DNS stand for?',
			options: ['Domain Name System', 'Dynamic Name Service', 'Domain Network Service', 'Dynamic Network System'],
			points: 10,
		},
		{
			text: 'Which protocol is used for secure data transmission over the internet?',
			options: ['HTTPS', 'HTTP', 'FTP', 'SMTP'],
			points: 15,
		},
		{
			text: 'What is the function of a firewall?',
			options: ['To monitor and control incoming and outgoing network traffic', 'To provide wireless access', 'To connect different networks', 'To store data'],
			points: 5,
		},
		{
			text: 'Which of the following is a common network topology?',
			options: ['Star', 'Circle', 'Square', 'Triangle'],
			points: 5,
		},
	],
	// Questions for Test 4
	[
		{
			text: 'What is the CAP theorem in distributed systems?',
			options: ['Consistency, Availability, Partition Tolerance', 'Consistency, Accessibility, Performance', 'Capacity, Availability, Partitioning', 'Consistency, Availability, Performance'],
			points: 15,
		},
		{
			text: 'Which of the following is a common challenge in distributed systems?',
			options: ['Network latency', 'Single point of failure', 'Data redundancy', 'Centralized control'],
			points: 10,
		},
		{
			text: 'What is a distributed hash table (DHT)?',
			options: ['A decentralized data structure for storing key-value pairs', 'A method for synchronizing data across nodes', 'A protocol for secure data transmission', 'A type of database management system'],
			points: 5,
		},
		{
			text: 'In a distributed system, what does "eventual consistency" mean?',
			options: ['All nodes will eventually converge to the same state', 'Data is always consistent across all nodes', 'Updates are immediately visible to all nodes', 'Data is only consistent during a transaction'],
			points: 15,
		},
		{
			text: 'Which protocol is commonly used for achieving consensus in distributed systems?',
			options: ['Paxos', 'TCP', 'HTTP', 'UDP'],
			points: 5,
		},
		{
			text: 'What is the primary purpose of a load balancer in a distributed system?',
			options: ['To distribute incoming network traffic across multiple servers', 'To store data in a centralized location', 'To ensure data consistency', 'To provide security against attacks'],
			points: 10,
		},
		{
			text: 'Which of the following is NOT a characteristic of microservices architecture?',
			options: ['Decentralized data management', 'Tightly coupled services', 'Independent deployment', 'Scalability'],
			points: 10,
		},
		{
			text: 'What is the role of a service registry in a microservices architecture?',
			options: ['To keep track of service instances and their locations', 'To manage user authentication', 'To store application data', 'To monitor system performance'],
			points: 10,
		},
		{
			text: 'Which of the following is a common method for ensuring data consistency in distributed databases?',
			options: ['Two-phase commit', 'Single-phase commit', 'Eventual consistency', 'Optimistic locking'],
			points: 10,
		},
		{
			text: 'What is a common approach to handle failures in distributed systems?',
			options: ['Retry mechanisms', 'Ignoring errors', 'Centralized logging', 'Immediate shutdown'],
			points: 10,
		},
	],
	// Questions for Test 5
	[
		{
			text: 'What is the primary function of the CPU?',
			options: ['To execute instructions', 'To store data', 'To manage input/output devices', 'To provide power'],
			points: 5,
		},
		{
			text: 'Which of the following is a type of memory that is non-volatile?',
			options: ['ROM', 'RAM', 'Cache', 'Registers'],
			points: 10,
		},
		{
			text: 'What does ALU stand for in computer architecture?',
			options: ['Arithmetic Logic Unit', 'Advanced Logic Unit', 'Arithmetic Load Unit', 'Analog Logic Unit'],
			points: 5,
		},
		{
			text: 'Which of the following is NOT a type of cache memory?',
			options: ['L1', 'L2', 'L3', 'L4'],
			points: 10,
		},
		{
			text: 'What is the purpose of the control unit in a CPU?',
			options: ['To direct the operation of the processor', 'To perform arithmetic operations', 'To store data temporarily', 'To manage input/output operations'],
			points: 10,
		},
		{
			text: 'Which of the following architectures is based on the concept of a single instruction stream and a single data stream?',
			options: ['SISD', 'SIMD', 'MISD', 'MIMD'],
			points: 10,
		},
		{
			text: 'What is the function of the system bus?',
			options: ['To transfer data between components', 'To provide power to the CPU', 'To store data', 'To manage input/output devices'],
			points: 10,
		},
		{
			text: 'Which of the following is an example of secondary storage?',
			options: ['hard Disk Drive', 'RAM', 'Cache Memory', 'Registers'],
			points: 15,
		},
		{
			text: 'What is pipelining in computer architecture?',
			options: ['A technique to improve instruction throughput', 'A method for data storage', 'A way to increase CPU clock speed', 'A type of memory management'],
			points: 15,
		},
		{
			text: 'Which of the following is a characteristic of RISC architecture?',
			options: ['Simple instructions and a large number of registers', 'Complex instructions and fewer registers', 'High power consumption', 'Low performance'],
			points: 10,
		},
	],
	// Questions for Test 6
	[
		{
			text: 'What is the primary function of an operating system?',
			options: ['To manage hardware and software resources', 'To provide a user interface', 'To execute applications', 'To manage network connections'],
			points: 10,
		},
		{
			text: 'Which of the following is a type of process scheduling algorithm?',
			options: ['Round Robin', 'FIFO', 'LIFO', 'All of the above'],
			points: 10,
		},
		{
			text: 'What is a deadlock in operating systems?',
			options: ['A situation where two or more processes each is waiting for the other', 'A state where a process is waiting for an I/O operation to complete', 'A condition where a process is terminated', 'A method of resource allocation'],
			points: 10,
		},
		{
			text: 'Which of the following is NOT a type of memory management technique?',
			options: ['Paging', 'Segmentation', 'Fragmentation', 'Swapping'],
			points: 15,
		},
		{
			text: 'What is the purpose of a system call in an operating system?',
			options: ['To request a service from the operating system', 'To terminate a process', 'To allocate memory', 'To manage file systems'],
			points: 5,
		},
		{
			text: 'Which of the following is a characteristic of a microkernel architecture?',
			options: ['Minimal core functionality with additional services running in user space', 'All services run in kernel space', 'High performance due to less context switching', 'Complexity in design'],
			points: 15,
		},
		{
			text: 'What is the role of the file system in an operating system?',
			options: ['To manage data storage and retrieval', 'To execute applications', 'To manage hardware resources', 'To provide a user interface'],
			points: 10,
		},
		{
			text: 'Which of the following is a common method for achieving process synchronization?',
			options: ['Semaphores', 'Mutexes', 'Monitors', 'All of the above'],
			points: 10,
		},
		{
			text: 'What is virtual memory?',
			options: ['A memory management technique that gives an application the illusion of a large memory space', 'A type of physical memory', 'A method for increasing CPU speed', 'A way to manage disk space'],
			points: 5,
		},
		{
			text: 'Which of the following is a common operating system?',
			options: ['Linux', 'Windows', 'macOS', 'All of the above'],
			points: 10,
		},
	],
	// Questions for Test 7
	[
		{
			text: 'What does SQL stand for?',
			options: ['Structured Query Language', 'Simple Query Language', 'Sequential Query Language', 'Standard Query Language'],
			points: 10,
		},
		{
			text: 'Which of the following is a type of database model?',
			options: ['Relational', 'Hierarchical', 'Network', 'All of the above'],
			points: 10,
		},
		{
			text: 'What is a primary key in a database?',
			options: ['A unique identifier for a record', 'A key used to encrypt data', 'A key that allows multiple records', 'A unique identifier that links two tables'],
			points: 10,
		},
		{
			text: 'Which SQL statement is used to retrieve data from a database?',
			options: ['SELECT', 'GET', 'FETCH', 'RETRIEVE'],
			points: 5,
		},
		{
			text: 'What is the purpose of a foreign key?',
			options: ['To create a relationship between two tables', 'To uniquely identify a record', 'To store large amounts of data', 'To index a table'],
			points: 10,
		},
		{
			text: 'Which of the following SQL commands is used to delete data from a table?',
			options: ['DELETE', 'DROP', 'REMOVE', 'TRUNCATE'],
			points: 5,
		},
		{
			text: 'What does the acronym ACID stand for in database management?',
			options: ['Atomicity, Consistency, Isolation, Durability', 'Atomicity, Consistency, Integrity, Durability', 'Atomicity, Concurrency, Isolation, Durability', 'Atomicity, Consistency, Isolation, Data'],
			points: 15,
		},
		{
			text: 'Which SQL clause is used to filter records?',
			options: ['WHERE', 'FILTER', 'HAVING', 'SELECT'],
			points: 10,
		},
		{
			text: 'What is normalization in database design?',
			options: ['The process of organizing data to reduce redundancy', 'The process of backing up data', 'The process of encrypting data', 'The process of indexing data'],
			points: 15,
		},
		{
			text: 'Which of the following is a NoSQL database?',
			options: ['MongoDB', 'MySQL', 'PostgreSQL', 'Oracle'],
			points: 10,
		},
	],
	// Questions for Test 8
	[
		{
			text: 'What does UI stand for in design?',
			options: ['User Interface', 'User Interaction', 'Universal Interface', 'User Integration'],
			points: 10,
		},
		{
			text: 'What is the primary goal of UX design?',
			options: ['To enhance user satisfaction', 'To create visually appealing designs', 'To increase website traffic', 'To improve SEO'],
			points: 10,
		},
		{
			text: 'Which of the following is a common method for user research?',
			options: ['Surveys', 'A/B Testing', 'Focus Groups', 'All of the above'],
			points: 10,
		},
		{
			text: 'What is a wireframe in UI/UX design?',
			options: ['A low-fidelity representation of a design', 'A high-fidelity representation of a design', 'A final design', 'A type of user feedback'],
			points: 10,
		},
		{
			text: 'Which principle emphasizes that users should not have to think too much when using a product?',
			options: ['Simplicity', 'Consistency', 'Feedback', 'Accessibility'],
			points: 10,
		},
		{
			text: 'What is the purpose of usability testing?',
			options: ['To evaluate a product by testing it with real users', 'To gather feedback from stakeholders', 'To analyze competitors', 'To create design specifications'],
			points: 10,
		},
		{
			text: 'Which of the following is an important aspect of responsive design?',
			options: ['Fluid grids', 'Fixed layouts', 'Static images', 'Single-column layouts'],
			points: 10,
		},
		{
			text: 'What does the term "affordance" refer to in design?',
			options: ['The properties of an object that suggest how it should be used', 'The visual appeal of a design', 'The amount of information presented', 'The speed of a website'],
			points: 15,
		},
		{
			text: 'Which color model is commonly used in digital design?',
			options: ['RGB', 'CMYK', 'HSB', 'LAB'],
			points: 5,
		},
		{
			text: 'What is the significance of a design system?',
			options: ['To create a consistent design language across products', 'To reduce the number of designers needed', 'To speed up the development process', 'To eliminate user feedback'],
			points: 10,
		},
	],
	// Questions for Test 9
	[
		{
			text: 'What is overfitting in machine learning?',
			options: ['When a model learns noise in the training data', 'When a model performs well on training data but poorly on unseen data', 'When a model is too simple to capture the underlying trend', 'Both A and B'],
			points: 15,
		},
		{
			text: 'Which of the following algorithms is used for classification tasks?',
			options: ['Support Vector Machines', 'K-Means Clustering', 'Principal Component Analysis', 'Linear Regression'],
			points: 10,
		},
		{
			text: 'What is the purpose of cross-validation in machine learning?',
			options: ['To assess how the results of a statistical analysis will generalize to an independent data set', 'To increase the size of the training dataset', 'To reduce overfitting', 'To improve model accuracy'],
			points: 5,
		},
		{
			text: 'Which of the following is a common metric for evaluating classification models?',
			options: ['Accuracy', 'Mean Squared Error', 'R-squared', 'Silhouette Score'],
			points: 5,
		},
		{
			text: 'What does the term "feature engineering" refer to?',
			options: ['The process of selecting, modifying, or creating features to improve model performance', 'The process of training a model', 'The process of evaluating a model', 'The process of deploying a model'],
			points: 15,
		},
		{
			text: 'Which of the following techniques is used to prevent overfitting?',
			options: ['Regularization', 'Increasing the number of features', 'Decreasing the size of the training set', 'Using a more complex model'],
			points: 10,
		},
		{
			text: 'What is the main difference between supervised and unsupervised learning?',
			options: ['Supervised learning uses labeled data, while unsupervised learning does not', 'Unsupervised learning is faster than supervised learning', 'Supervised learning requires more data than unsupervised learning', 'There is no difference'],
			points: 10,
		},
		{
			text: 'Which of the following is an example of a regression algorithm?',
			options: ['Linear Regression', 'K-Nearest Neighbors', 'Decision Trees', 'Random Forest'],
			points: 5,
		},
		{
			text: 'What is the purpose of a confusion matrix?',
			options: ['To evaluate the performance of a classification model', 'To visualize the decision boundary', 'To assess the importance of features', 'To optimize hyperparameters'],
			points: 10,
		},
		{
			text: 'Which of the following is a common technique for dimensionality reduction?',
			options: ['Principal Component Analysis (PCA)', 'K-Means Clustering', 'Support Vector Machines', 'Random Forest'],
			points: 15,
		},
	],
	// Questions for Test 10
	[
		{
			text: 'What does HTML stand for?',
			options: ['HyperText Markup Language', 'HighText Machine Language', 'HyperText Markup Level', 'None of the above'],
			points: 5,
		},
		{
			text: 'Which of the following is a CSS framework?',
			options: ['Bootstrap', 'JavaScript', 'HTML5', 'jQuery'],
			points: 5,
		},
		{
			text: 'What is the purpose of the <head> tag in HTML?',
			options: ['To contain meta-information about the document', 'To display the main content', 'To create a navigation menu', 'To include scripts'],
			points: 15,
		},
		{
			text: 'Which of the following is a JavaScript data type?',
			options: ['String', 'Integer', 'Float', 'All of the above'],
			points: 10,
		},
		{
			text: 'What does CSS stand for?',
			options: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
			points: 5,
		},
		{
			text: 'Which of the following is used to make an HTTP request in JavaScript?',
			options: ['fetch()', 'getRequest()', 'httpRequest()', 'ajax()'],
			points: 10,
		},
		{
			text: 'What is the purpose of the <div> tag in HTML?',
			options: ['To create a block-level container', 'To create a hyperlink', 'To display an image', 'To create a list'],
			points: 15,
		},
		{
			text: 'Which of the following is a popular JavaScript library for building user interfaces?',
			options: ['React', 'Django', 'Ruby on Rails', 'Flask'],
			points: 10,
		},
		{
			text: 'What is the function of the <form> tag in HTML?',
			options: ['To collect user input', 'To display images', 'To create a table', 'To link to other pages'],
			points: 15,
		},
		{
			text: 'Which of the following is a method to style an HTML element?',
			options: ['Inline CSS', 'Internal CSS', 'External CSS', 'All of the above'],
			points: 10,
		},
	],
	// Questions for Test 11
	[
		{
			text: 'What does CPU stand for?',
			options: ['Central Processing Unit', 'Computer Personal Unit', 'Centralized Processing Unit', 'Computer Processing Unit'],
			points: 10,
		},
		{
			text: 'Which component is considered the brain of the computer?',
			options: ['CPU', 'RAM', 'hard Drive', 'Motherboard'],
			points: 10,
		},
		{
			text: 'What is the function of RAM in a computer?',
			options: ['To store data temporarily', 'To store data permanently', 'To process data', 'To connect peripherals'],
			points: 10,
		},
		{
			text: 'Which of the following is a type of storage device?',
			options: ['SSD', 'CPU', 'GPU', 'RAM'],
			points: 10,
		},
		{
			text: 'What does GPU stand for?',
			options: ['Graphics Processing Unit', 'General Processing Unit', 'Graphical Personal Unit', 'Graphics Personal Unit'],
			points: 10,
		},
		{
			text: 'Which of the following is an input device?',
			options: ['Keyboard', 'Monitor', 'Printer', 'Speaker'],
			points: 10,
		},
		{
			text: 'What is the purpose of a motherboard?',
			options: ['To connect all components of a computer', 'To store data', 'To process graphics', 'To manage power supply'],
			points: 10,
		},
		{
			text: 'Which of the following is a type of network interface card (NIC)?',
			options: ['Ethernet card', 'Sound card', 'Graphics card', 'Video card'],
			points: 10,
		},
		{
			text: 'What is the primary function of a power supply unit (PSU)?',
			options: ['To convert AC to DC power for the computer', 'To store data', 'To process information', 'To manage cooling'],
			points: 10,
		},
		{
			text: 'Which of the following is a common type of RAM?',
			options: ['DDR4', 'SSD', 'HDD', 'Flash'],
			points: 10,
		},
	],
	// Questions for Test 12
	[
		{
			text: 'What is the primary purpose of Enterprise Resource Planning (ERP) software?',
			options: ['To integrate and manage core business processes', 'To manage customer relationships', 'To handle project management', 'To provide business intelligence'],
			points: 10,
		},
		{
			text: 'Which of the following is a common characteristic of enterprise software?',
			options: ['Scalability', 'Simplicity', 'Single-user access', 'Low cost'],
			points: 15,
		},
		{
			text: 'What does CRM stand for in the context of enterprise software?',
			options: ['Customer Relationship Management', 'Corporate Resource Management', 'Client Resource Management', 'Customer Retention Management'],
			points: 10,
		},
		{
			text: 'Which of the following is a benefit of using cloud-based enterprise software?',
			options: ['Accessibility from anywhere', 'Higher upfront costs', 'Limited scalability', 'Complex installation process'],
			points: 15,
		},
		{
			text: 'What is the role of middleware in enterprise applications?',
			options: ['To facilitate communication between different software applications', 'To store data', 'To manage user interfaces', 'To provide security'],
			points: 5,
		},
		{
			text: 'Which of the following is an example of an enterprise software solution?',
			options: ['SAP', 'Photoshop', 'Notepad', 'WinRAR'],
			points: 10,
		},
		{
			text: 'What is the purpose of Business Process Management (BPM) software?',
			options: ['To model, automate, and optimize business processes', 'To manage customer relationships', 'To handle financial transactions', 'To provide data analytics'],
			points: 10,
		},
		{
			text: 'Which of the following is a common challenge when implementing enterprise software?',
			options: ['User resistance to change', 'Low initial costs', 'Simplicity of integration', 'Immediate ROI'],
			points: 15,
		},
		{
			text: 'What does the term "data silos" refer to in enterprise software?',
			options: ['Isolated data that is not easily accessible across the organization', 'Centralized data storage', 'Data that is shared across departments', 'Data that is encrypted across the organization'],
			points: 5,
		},
		{
			text: 'Which of the following methodologies is commonly used in enterprise software development?',
			options: ['Agile', 'Waterfall', 'V-Model', 'All of the above'],
			points: 5,
		},
	],
];

const questions = questions_Temp1.map((questions, index) => {
	const testId = index + 1; // Test IDs start from 1
	return questions.map(question => ({
		testId: testId,
		options: JSON.stringify(question.options),
		text: question.text,
		points: question.points,
		correctAnswer: 0
	}));
}).flat();

const attempts = [
	{
		testId: 1,
		candidateId: '1',
		score: 85,
		status: 'Finished',
	},
	{
		testId: 1,
		candidateId: '2',
		score: 90,
		status: 'Finished',
	},
	{
		testId: 2,
		candidateId: '1',
		score: 65,
		status: 'Finished',
	},
	{
		testId: 2,
		candidateId: '3',
		score: 45,
		status: 'Finished',
	},
	{
		testId: 3,
		candidateId: '4',
		score: 100,
		status: 'Finished',
	},
	{
		testId: 4,
		candidateId: '5',
		score: 20,
		status: 'Finished',
	},
	{
		testId: 5,
		candidateId: '6',
		score: 40,
		status: 'Finished',
	},
	{
		testId: 7,
		candidateId: '2',
		score: 75,
		status: 'Finished',
	},
	{
		testId: 7,
		candidateId: '1',
		score: 80,
		status: 'Finished',
	},
	{
		testId: 7,
		candidateId: '1',
		score: 35,
		status: 'Finished',
	},
	{
		testId: 8,
		candidateId: '2',
		score: 60,
		status: 'Finished',
	},
	{
		testId: 8,
		candidateId: '5',
		score: 80,
		status: 'Finished',
	},
	{
		testId: 8,
		candidateId: '3',
		score: 30,
		status: 'Finished',
	},
	{
		testId: 9,
		candidateId: '3',
		score: 35,
		status: 'Finished',
	},
	{
		testId: 9,
		candidateId: '4',
		score: 20,
		status: 'Finished',
	},
	{
		testId: 10,
		candidateId: '4',
		score: 100,
		status: 'Finished',
	},
	{
		testId: 10,
		candidateId: '3',
		score: 5,
		status: 'Finished',
	},
	{
		testId: 11,
		candidateId: '1',
		score: 100,
		status: 'Finished',
	},
];

const attemptsAnswerQuestions = attempts.map((attempt, a_index) => {
	const qusetionsOfAttempt = questions.filter(question => question.testId === attempt.testId);
	const answerQuestions = qusetionsOfAttempt.map((question, q_index) => {
		const randomOption = Math.floor(Math.random() * (question.options.length + 1)) - 1;
		if (randomOption === -1) {
			return null;
		}
		return {
			attemptId: a_index + 1,
			questionId: q_index + 1,
			chosenOption: randomOption
		};
	});
	return answerQuestions;
}).flat().filter(answer => answer !== null);

export default {
	tags,
	testsTags,
	tests,
	questions,
	attempts,
	attemptsAnswerQuestions
}