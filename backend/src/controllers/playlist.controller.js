import { db } from "../lib/db.js"

const getAllPlaylists = async (req, res) => {
    try {
        const playlists = await db.playlist.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        })
        if (playlists.length === 0)
            return res.status(400).json({
                success: false,
                message: `Playlist not found`
            })

        res.status(200).json({
            success: true,
            message: `Playlist fetched successfully!`,
            playlists
        })
    } catch (error) {
        console.error(`Error: error fetching playlist ${error}`);
        res.status(500).json({
            success: false,
            error: `Error: error fetching playlist ${error}`
        })
    }
}

const createPlaylist = async (req, res) => {
    try {
        const { name, description } = req.body;
        const playlist = await db.playlist.create({
            data: {
                name,
                description,
                userId: req.user.id
            }
        })
        res.status(200).json({
            success: true,
            message: `Playlist created successfully`,
            playlist
        })

    } catch (error) {
        console.error(`Error: error creating playlist ${error}`);
        res.status(500).json({
            success: false,
            error: `Error: error creating playlist ${error}`
        })
    }
}

const getPlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params
        const playlist = await db.playlist.findUnique({
            where: {
                userId: req.user.id,
                id: playlistId
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        })
        if (!playlist)
            return res.status(400).json({
                success: false,
                error: `Playlist not found`
            })
        res.status(200).json({
            success: true,
            error: `Playlist found successfully`,
            playlist
        })
    } catch (error) {
        console.error(`Error: error finding playlist ${error}`);
        res.status(500).json({
            success: false,
            error: `Error: error finding playlist ${error}`
        })
    }
}

const addProblemToPlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const { problemIds } = req.body;
        if (!Array.isArray(problemIds) || problemIds.length === 0)
            return res.status(400).json({ success: false, error: `Invalid or missing problemIds` })

        const problemInPlaylist = await db.problemInPlaylist.createMany({
            data: problemIds.map((problemId) => ({
                playlistId,
                problemId
            }))
        })
        res.status(201).json({
            success: true,
            message: `Problem added in playlist successfully`,
            problemInPlaylist
        })
    } catch (error) {
        console.error(`Error: error adding problem in playlist ${error}`);
        res.status(500).json({
            success: false,
            error: `Error: error adding problem playlist ${error}`
        })
    }
}

const deletePlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params
        const playlist = await db.playlist.findUnique({ where: { id: playlistId } });
        if (!playlist)
            return res.status(400).json({
                success: false,
                error: `Playlist not found`
            })
        await db.playlist.delete({ where: { id: playlistId } })
        res.status(200).json({
            success: true,
            message: `Playlist deleted successfully`
        })
    } catch (error) {
        console.error(`Error: error deleting playlist ${error}`);
        res.status(500).json({
            success: false,
            error: `Error: error deleting playlist ${error}`
        })
    }
}

const removeProblemFromPlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const { problemIds } = req.body;
        if (!Array.isArray(problemIds) || problemIds.length === 0)
            return res.status(400).json({ success: false, error: `Invalid or missing problemIds` })
        const removedProblems = await db.problemInPlaylist.deleteMany({
            where: {
                playlistId,
                problemId: {
                    in: problemIds
                }
            }
        })
        res.status(200).json({ success: true, message: `Successfully removed problem form playlist `, removedProblems })

    } catch (error) {
        console.error(`Error: error removing problem from playlist ${error}`);
        res.status(500).json({
            success: false,
            error: `Error: error removing problem from playlist ${error}`
        })
    }

}
export { getAllPlaylists, createPlaylist, getPlaylist, addProblemToPlaylist, deletePlaylist, removeProblemFromPlaylist }