import log from "loglevel";
import _ from "lodash";
import type { Request, Response } from "express";

/**
 * When this Insight Module is added to a new ExoSense, this will get called.
 *
 * solution_id String The solution identifier. Set automatically.
 * no response value expected for this operation
 **/
export async function createSolution(req: Request, res: Response) {
  const solution_id = req.params.solution_id;
  log.info("Added to ExoSense Install ID: " + solution_id);
  res.status(200).send();
}

/**
 * When this Insight Module is removed from an ExoSense, this will get called.
 * Also called if the ExoSense was deleted.
 *
 * solution_id String The solution identifier. Set automatically.
 * no response value expected for this operation
 **/
export async function delSolution(req: Request, res: Response) {
  const solution_id = req.params.solution_id;
  log.info("Removed from ExoSense Install ID: " + solution_id);
  res.status(205).send();
}

/**
 * Get some info about this Insight
 *
 * solution_id String The solution identifier. Set automatically by Murano at service call.
 * returns InsightInfoResults
 **/
export async function info(req: Request, res: Response) {
  const solution_id = req.params.solution_id;
  res.status(200).send({
    group_id_required: false,
    name: "My Example Insight Module",
    description: "description",
    wants_lifecycle_events: true,
  });
}

type ValueType = number | boolean | string | Record<string, any>;
interface SignalData {
  ts: number; // Unix timestamp in microseconds of when the data originated
  gts?: number; // Unix timestamp in microseconds of when this SignalData was generated (Read only)
  tags?: { [tag: string]: string }; // Tag-Value pairs to help ID the data.  Used to tie the data back to an Asset or Device or other things.
  value: ValueType; // The actual data value for this instance
  origin: string; // The original Publishing ID
  generated: string; // The Publishing ID that created this SignalData
  ttl?: number; // Value used to help prevent data from infinitely cycling (Read only)
}

type ValueFn = (
  value: number | boolean | string | Record<string, any>,
  constants: Record<string, any>,
  solution_id: string
) => number;
type DataFn = (
  data: SignalData,
  constants: Record<string, any>,
  solution_id: string
) => SignalData[][];

interface InsightModuleFunction {
  id?: string;
  name: string;
  description: string;
  translations?: { [lang: string]: { name?: string; description?: string } };
  type: "transform" | "rule" | "action";
  constants?: ConstantInfo[];
  constants_multiple_maximum?: number;
  inlets?: SignalTypeInputInfo[];
  outlets?: SignalTypeOutputInfo[];

  action?: {
    onValue?: ValueFn;
    onData?: DataFn;
  };
}

interface ConstantInfo {
  name: string;
  type: "string" | "number" | "boolean";
  description?: string;
  default?: string | number | boolean;
  enum?: (string | number | boolean)[];
  enum_presented?: string[];
  maximum?: number;
  minimum?: number;
  multiple?: boolean;
  required?: boolean;
  translations?: {
    [lang: string]: { description?: string; enum_presented?: string[] };
  };
}

interface SignalTypeInputInfo {
  primitive_type?: "NUMERIC" | "STRING" | "BOOLEAN" | "JSON";
  data_type?: string[];
  data_unit?: string[];
  tag?: string;
  name: string;
  description?: string;
  translations?: {
    [lang: string]: {
      name?: string;
      description?: string;
    };
  };
}

interface SignalTypeOutputInfo {
  primitive_type?: "NUMERIC" | "STRING" | "BOOLEAN" | "JSON";
  data_type?: string[];
  data_unit?: string[];
  name?: string;
  description?: string;
  suggested_name?: string;
  translations?: {
    [lang: string]: {
      name?: string;
      description?: string;
      suggested_name?: string;
    };
  };
}

/* All of the functions this module supports.
 */
const insightFunctionList: Record<string, InsightModuleFunction> = {
  linearGain: {
    constants: [
      {
        name: "gain",
        type: "number",
        description: "Gain",
        default: 1,
        required: true,
      },
      {
        name: "offset",
        type: "number",
        description: "Offset",
        default: 0,
        required: true,
      },
    ],
    description: "Compute a Linear Gain (result = gain * x + offset)",
    name: "Linear Gain",
    type: "transform",
    inlets: [{ primitive_type: "NUMERIC", tag: "A", name: "What goes in" }],
    outlets: [{ primitive_type: "NUMERIC", name: "What comes out" }],
    action: {
      // onValue() called for each data value; is passed only the value and constants.
      onValue: (value, constants, solution_id) => {
        return Number(value) * constants.gain + constants.offset;
      },
      // onData() called for each data value; is passed entire SignalData object and all function args.
      // If both are defined, onValue() is used and onData() is ignored.
    },
  },
};

/**
 * Get info about one Insight Function
 *
 * solution_id String The solution identifier. Set automatically by Murano at service call.
 * function_id String Identifier of function
 * returns InsightInfo
 **/
export async function infoInsight(req: Request, res: Response) {
  const solution_id = req.params.solution_id;
  const function_id = req.params.function_id;
  log.debug("infoInsight", function_id);
  if (!_.has(insightFunctionList, function_id)) {
    res.status(400).send({
      name: "Not Implemented",
      solution_id: solution_id,
      message: `The function ${function_id} is not implemented`,
    });
    return;
  }
  const ifn = insightFunctionList[function_id];
  const result = _.assign(_.omit(ifn, "action"), { id: function_id });
  res.status(200).send(result);
}

/**
 * Notifications of when a linkage that will call the process function is created or deleted.
 *
 * solution_id String The solution identifier. Set automatically by Murano at service call.
 * body LifecycleEvent Lifecycle event
 * no response value expected for this operation
 **/
export async function lifecycle(req: Request, res: Response) {
  const solution_id = req.params.solution_id;
  const body = req.body;
  log.debug(body);
  const event = body.event || "nop";
  const lid = body.id || "--missing--";
  const args = body.args || {};
  log.info(
    `From ExoSense ID: ${solution_id} Linkage ${lid} was ${event} with ${JSON.stringify(
      args
    )}`
  );
  res.status(200).send();
}

/**
 * Get a list of available Insight Functions and info about them
 *
 * solution_id String The solution identifier. Set automatically by Murano at service call.
 * body InsightsFilterParams Get a list of available insight functions
 * returns InsightListResults
 **/
export async function listInsights(req: Request, res: Response) {
  const result = {
    total: _.keys(insightFunctionList).length,
    count: _.keys(insightFunctionList).length,
    insights: _.transform(
      insightFunctionList,
      (res: any[], val, key) => {
        res.push(_.assign(_.omit(val, "action"), { id: key }));
      },
      []
    ),
  };
  res.status(200).send(result);
}

async function processMany(
  data: SignalData[],
  args: Record<string, any>,
  solutionId: string,
  work_fn: DataFn
): Promise<SignalData[][]> {
  // Fan these all out.
  const promises = data.map(i => {
    return work_fn(i, args, solutionId);
  });

  const collected = await Promise.all(promises);

  if (collected.length === 0) {
    return [];
  }
  // Pull results back into the format we expect,
  // An array of arrays of SignalData, But the inner and outer arrays need to be swapped.
  // The input: is an array of results, each of which is an array of outlets
  // The output: is an array of the outlets, each of which is an array of SignalData (multiple results per outlet)
  const returning = collected.reduce(
    (acc, cur) => {
      return [acc[0].concat(cur[0] || []), acc[1].concat(cur[1] || [])];
    },
    [[], []]
  );

  return returning;
}

/**
 * For a given function_id, get the implementation function with optional wrapping
 * @param {*} solution_id
 * @param {*} function_id
 */
function build_fn(solution_id: string, function_id: string): DataFn {
  if (insightFunctionList?.[function_id]?.action?.onValue) {
    const onValue = insightFunctionList[function_id].action?.onValue;

    return (data: SignalData, args: Record<string, any>, sol_id: string) => {
      const res_value = onValue(
        data?.value ?? 0,
        args?.constants ?? {},
        solution_id
      );

      return [[Object.assign({}, data, { value: res_value })]];
    };
  } else if (insightFunctionList?.[function_id]?.action?.onData) {
    return insightFunctionList[function_id].action.onData;
  }
  return (data, _args, _sol_id) => {
    return [[data]];
  };
}

/**
 * Your function to process a bunch of Signal Data.
 *
 * solution_id String The solution identifier. Set automatically by Murano at service call.
 * body SignalDataObjectArray Data to process and arguments on how to process it
 * returns SignalDataArrayArray
 **/
export async function process(req: Request, res: Response) {
  const solution_id = req.params.solution_id;
  const { data = [], args = {} } = req.body;
  const { function_id = "" } = args;
  log.debug(data);

  if (!insightFunctionList?.[function_id]) {
    res.status(400).send({
      name: "Not Implemented",
      message: `The function "${function_id}" is not implemented`,
    });
    return;
  }
  const work_fn = build_fn(solution_id, function_id);

  try {
    const result = await processMany(data, args, solution_id, work_fn);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ error: "Processing failed", details: err });
  }
}
