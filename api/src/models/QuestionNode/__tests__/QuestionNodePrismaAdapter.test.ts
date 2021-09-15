import { Prisma } from "@prisma/client";
import cuid from 'cuid';

import { makeTestPrisma } from "../../../test/utils/makeTestPrisma";
import { clearDatabase } from './testUtils';
import QuestionNodePrismaAdapter from '../QuestionNodePrismaAdapter';


const prisma = makeTestPrisma();
const questionNodePrismaAdapter = new QuestionNodePrismaAdapter(prisma);

describe('QuestionNodePrismaAdapter', () => {

    afterEach(async () => {
        await clearDatabase(prisma);
        await prisma.$disconnect();
    });

    test('Creates, reads, updates and deletes a video node', async () => {
        const questionNode = await prisma.questionNode.create({
            data: {
                title: 'questionNodeOne',
            }
        });

        // Creates a video node
        const videoNode = await questionNodePrismaAdapter.createVideoNode({
            parentNodeId: questionNode.id,
            videoUrl: 'https://video-url.here',
        });

        // Reads a video node
        const existingVideoNode = await questionNodePrismaAdapter.getVideoNodeById(videoNode.id);
        expect(existingVideoNode).not.toBeNull();
        expect(existingVideoNode?.videoUrl).toBe('https://video-url.here');

        // Updates a video node
        await questionNodePrismaAdapter.updateVideoNode(videoNode.id, { videoUrl: 'https://new-url.now' });
        const nodeWithUpdatedVideoUrl = await questionNodePrismaAdapter.findNodeById(questionNode.id);
        expect(nodeWithUpdatedVideoUrl?.videoEmbeddedNode?.videoUrl).toBe('https://new-url.now');

        // Deletes a video node
        await questionNodePrismaAdapter.deleteVideoNode(videoNode.id);
        const nonExistingVideoNode = await questionNodePrismaAdapter.getVideoNodeById(videoNode.id);
        expect(nonExistingVideoNode).toBeNull();
    });

    test('Creates, reads, updates and deletes a slider node', async () => {
        const questionNode = await prisma.questionNode.create({
            data: {
                title: 'questionNodeOne',
            }
        });

        const sliderNode = await questionNodePrismaAdapter.createSliderNode({
            parentNodeId: questionNode.id,
            happyText: 'Satisfied',
            unhappyText: 'Dissatisfied',
            markers: [
                {
                    label: 'Amazing!',
                    subLabel: 'Things are looking good',
                    range: {
                        start: 75,
                        end: 100,
                    },
                },
                {
                    label: 'Pretty good!',
                    subLabel: 'Yea it is pretty alright',
                    range: {
                        start: 50,
                        end: 75,
                    },
                },
                {
                    label: 'It is okay!',
                    subLabel: 'Not too bad',
                    range: {
                        start: 0,
                        end: 50,
                    },
                },
            ],
        });

        // const nodeWithSliderNode = await prisma.questionNode.findUnique({
        //     where: {
        //         id: questionNode.id,
        //     },
        //     include: {
        //         sliderNode: true,
        //     },
        // });

        // expect(nodeWithSliderNode?.sliderNode).not.toBeNull();
    });

    // test('Upserts a slider node', async () => {

    // });

});