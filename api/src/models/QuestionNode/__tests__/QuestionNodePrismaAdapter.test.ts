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

        // Creates slider node
        const sliderNode = await questionNodePrismaAdapter.createSliderNode({
            parentNodeId: questionNode.id,
            happyText: 'Satisfied',
            unhappyText: 'Dissatisfied',
            markers: [
                {
                    id: '-1',
                    label: 'Amazing!',
                    subLabel: 'This is excellent.',
                    range: { start: 9.5 },
                },
                {
                    id: '-2',
                    label: 'Good!',
                    subLabel: 'This is good.',
                    range: { start: 6, end: 9.5 },
                },
                {
                    id: '-3',
                    label: 'Neutral!',
                    subLabel: 'Something is not great.',
                    range: { start: 5, end: 6 },
                },
                {
                    id: '-4',
                    label: 'Bad',
                    subLabel: 'This is bad.',
                    range: { start: 3, end: 5 },
                },
                {
                    id: '-5',
                    label: 'Terrible',
                    subLabel: 'This is terrible',
                    range: { end: 3 },
                },
            ],
        });

        // Reads slider node
        const nodeWithSliderNode = await prisma.questionNode.findUnique({
            where: {
                id: questionNode.id,
            },
            include: {
                sliderNode: {
                    include: {
                        markers: true,
                    }
                },
            },
        });

        expect(nodeWithSliderNode?.sliderNode).not.toBeNull();
        expect(nodeWithSliderNode?.sliderNode?.happyText).toBe('Satisfied');
        expect(nodeWithSliderNode?.sliderNode?.unhappyText).toBe('Dissatisfied');
        expect(nodeWithSliderNode?.sliderNode?.markers).toHaveLength(5);

        // Updates slider node 
        await questionNodePrismaAdapter.updateSliderNode(nodeWithSliderNode?.sliderNode?.id || '-1', {
            happyText: 'Happy',
            unhappyText: 'Unhappy',
            markers: [
                {
                    id: '-1',
                    label: 'Great!',
                    subLabel: 'This is awesome.',
                },
            ],
        });

        const nodeWithUpdatedSliderNode = await prisma.questionNode.findUnique({
            where: {
                id: questionNode.id,
            },
            include: {
                sliderNode: {
                    include: {
                        markers: true,
                    }
                },
            },
        });

        expect(nodeWithUpdatedSliderNode?.sliderNode?.happyText).toBe('Happy');
        expect(nodeWithUpdatedSliderNode?.sliderNode?.unhappyText).toBe('Unhappy');
        const updatedMarker = nodeWithUpdatedSliderNode?.sliderNode?.markers.find((marker) => marker.id === '-1');
        expect(updatedMarker?.label).toBe('Great!');
        expect(updatedMarker?.subLabel).toBe('This is awesome.');

        // Deletes slider node
        await questionNodePrismaAdapter.deleteSliderNode(nodeWithUpdatedSliderNode?.sliderNodeId || '-1');
        const nodeWithoutSliderNode = await prisma.questionNode.findUnique({
            where: {
                id: questionNode.id,
            },
            include: {
                sliderNode: true,
            },
        });

        expect(nodeWithoutSliderNode?.sliderNode).toBeNull();

    });

    // test('Upserts a slider node', async () => {

    // });

});