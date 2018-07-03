export interface IZoneTag { 
    ts: number; 
    trigger_cnt: number;     
    value: number;     
    zone_name: string;
    ts_ms:number;
    station_no:string;
    prev_ts:number;
    prev_ts_ms:number;
    prev_value: number;
    line_id: number;
    tag_name: string;

}