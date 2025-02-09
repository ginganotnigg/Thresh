const KafkaJs = require("kafkajs");
require("dotenv").config();

const clientId = "my-kafka";
const kafkaHost = process.env.KAFKA_HOST || "localhost";
const kafkaPort = process.env.KAFKA_PORT || "9092";
const kafkaTopicQuestion = process.env.KAFKA_TOPIC_QUESTION || "question";

const brokers = [`${kafkaHost}:${kafkaPort}`];
const topic = `${kafkaTopicQuestion}`;

const kafka = new KafkaJs.Kafka({ clientId, brokers });
const producer = kafka.producer({ createPartitioner: KafkaJs.Partitioners.LegacyPartitioner });

const produce = async (question) => {
    await producer.connect();
    await producer.send({
        topic,
        messages: [
            {
                key: question.ID,
                value: JSON.stringify(question),
            },
        ],
    });
    await producer.disconnect();
};

module.exports = { produce };