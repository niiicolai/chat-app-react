
/**
 * @interface RoomFileSettings
 * @description The RoomFileSettings interface
 */
export default interface RoomFileSettings {
    file_days_to_live: number;
    single_file_bytes_allowed: number;
    single_file_mb: number;
    total_files_bytes_allowed: number;
    total_files_mb: number;
}
