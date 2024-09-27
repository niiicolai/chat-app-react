
/**
 * @interface RoomFileSettings
 * @description The RoomFileSettings interface
 */
export default interface RoomFileSettings {
    fileDaysToLive: number;
    singleFileBytesAllowed: number;
    singleFileMb: number;
    totalFilesBytesAllowed: number;
    totalFilesMb: number;
}
